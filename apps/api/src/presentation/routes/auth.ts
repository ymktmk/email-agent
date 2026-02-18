import { Hono } from 'hono';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { prisma } from '../../infrastructure/prisma/client';

export const authRoute = new Hono();

type LoginProvider = 'google.com' | 'microsoft.com';

const initializeFirebaseAdmin = () => {
  if (getApps().length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin の環境変数が不足しています。');
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
};

const mapProvider = (provider: LoginProvider) => {
  if (provider === 'google.com') {
    return 'GOOGLE' as const;
  }

  return 'MICROSOFT' as const;
};

authRoute.post('/firebase-login', async (c) => {
  const body = await c.req.json<{ idToken?: string }>();

  if (!body.idToken) {
    return c.json({ message: 'idToken は必須です。' }, 400);
  }

  try {
    initializeFirebaseAdmin();
  } catch (error) {
    return c.json({ message: (error as Error).message }, 500);
  }

  let decodedToken;

  try {
    decodedToken = await getAuth().verifyIdToken(body.idToken);
  } catch {
    return c.json({ message: 'idToken の検証に失敗しました。' }, 401);
  }

  const email = decodedToken.email;
  const name = decodedToken.name;

  if (!email || !name) {
    return c.json({ message: 'Firebase トークンに email または name が含まれていません。' }, 400);
  }

  const provider = decodedToken.firebase.sign_in_provider as LoginProvider;

  if (provider !== 'google.com' && provider !== 'microsoft.com') {
    return c.json({ message: 'Google または Microsoft ログインのみ対応しています。' }, 400);
  }

  const user = await prisma.user.upsert({
    where: { firebaseUid: decodedToken.uid },
    create: {
      firebaseUid: decodedToken.uid,
      authProvider: mapProvider(provider),
      email,
      name
    },
    update: {
      authProvider: mapProvider(provider),
      email,
      name
    },
    select: {
      id: true,
      email: true,
      name: true,
      authProvider: true
    }
  });

  return c.json({ user });
});
