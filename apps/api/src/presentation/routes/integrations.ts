import { Hono } from 'hono';
import { prisma } from '../../infrastructure/prisma/client';
import { signOAuthState, verifyOAuthState } from '../../application/services/oauthState';

const integrationRoute = new Hono();

type Provider = 'gmail' | 'outlook';

const getProvider = (name: string): Provider | null => {
  if (name === 'gmail' || name === 'outlook') {
    return name;
  }

  return null;
};

integrationRoute.post('/:provider/connect', async (c) => {
  const provider = getProvider(c.req.param('provider'));

  if (!provider) {
    return c.json({ message: '対応していないプロバイダーです。' }, 400);
  }

  const body = await c.req.json<{ userId?: string }>();

  if (!body.userId) {
    return c.json({ message: 'userId が必要です。' }, 400);
  }

  const statePayload = JSON.stringify({
    userId: body.userId,
    provider,
    timestamp: Date.now()
  });

  const state = signOAuthState(statePayload);
  const callbackUrl = `${process.env.API_BASE_URL ?? 'http://localhost:8787'}/api/integrations/${provider}/callback`;

  if (provider === 'gmail') {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return c.json({ message: 'GOOGLE_CLIENT_ID が未設定です。' }, 500);
    }

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', callbackUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile https://www.googleapis.com/auth/gmail.readonly');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('state', state);

    return c.json({ authUrl: url.toString() });
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;

  if (!clientId) {
    return c.json({ message: 'MICROSOFT_CLIENT_ID が未設定です。' }, 500);
  }

  const url = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('response_mode', 'query');
  url.searchParams.set('scope', 'offline_access openid profile email Mail.Read');
  url.searchParams.set('state', state);

  return c.json({ authUrl: url.toString() });
});

integrationRoute.get('/:provider/callback', async (c) => {
  const provider = getProvider(c.req.param('provider'));

  if (!provider) {
    return c.text('対応していないプロバイダーです。', 400);
  }

  const state = c.req.query('state');
  const code = c.req.query('code');

  if (!state || !code) {
    return c.text('state または code が不足しています。', 400);
  }

  const payload = verifyOAuthState(state);

  if (!payload) {
    return c.text('state が不正です。', 401);
  }

  const parsed = JSON.parse(payload) as { userId: string; provider: Provider; timestamp: number };

  if (parsed.provider !== provider || Date.now() - parsed.timestamp > 10 * 60 * 1000) {
    return c.text('state が無効、または期限切れです。', 401);
  }

  const callbackUrl = `${process.env.API_BASE_URL ?? 'http://localhost:8787'}/api/integrations/${provider}/callback`;

  const tokenResponse =
    provider === 'gmail' ? await fetchGoogleToken(code, callbackUrl) : await fetchMicrosoftToken(code, callbackUrl);

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();

    return c.text(`トークン交換に失敗しました: ${detail}`, 500);
  }

  const tokenBody = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const providerEmail =
    provider === 'gmail' ? await fetchGoogleEmail(tokenBody.access_token) : await fetchMicrosoftEmail(tokenBody.access_token);

  await prisma.connectedAccount.upsert({
    where: {
      userId_provider: {
        userId: parsed.userId,
        provider: provider === 'gmail' ? 'GMAIL' : 'OUTLOOK'
      }
    },
    create: {
      userId: parsed.userId,
      provider: provider === 'gmail' ? 'GMAIL' : 'OUTLOOK',
      providerEmail,
      accessToken: tokenBody.access_token,
      refreshToken: tokenBody.refresh_token,
      expiresAt: tokenBody.expires_in ? new Date(Date.now() + tokenBody.expires_in * 1000) : null
    },
    update: {
      providerEmail,
      accessToken: tokenBody.access_token,
      refreshToken: tokenBody.refresh_token,
      expiresAt: tokenBody.expires_in ? new Date(Date.now() + tokenBody.expires_in * 1000) : null
    }
  });

  return c.html('<h1>連携が完了しました。タブを閉じてアプリに戻ってください。</h1>');
});

const fetchGoogleToken = (code: string, redirectUri: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth の環境変数が不足しています。');
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  return fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
};

const fetchMicrosoftToken = (code: string, redirectUri: string) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Microsoft OAuth の環境変数が不足しています。');
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  return fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
};

const fetchGoogleEmail = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as { email?: string };

  return body.email ?? null;
};

const fetchMicrosoftEmail = async (accessToken: string) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as { mail?: string; userPrincipalName?: string };

  return body.mail ?? body.userPrincipalName ?? null;
};

export { integrationRoute };
