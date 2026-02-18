const firebaseAppModule = 'firebase/app';
const firebaseAuthModule = 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const loadFirebaseSdk = async () => {
  try {
    const appSdk = await import(/* @vite-ignore */ firebaseAppModule);
    const authSdk = await import(/* @vite-ignore */ firebaseAuthModule);

    const app = appSdk.initializeApp(firebaseConfig);
    const auth = authSdk.getAuth(app);

    return { auth, authSdk };
  } catch {
    throw new Error('Firebase SDK が見つかりません。`firebase` パッケージをインストールしてください。');
  }
};

export const loginWithGoogle = async () => {
  const { auth, authSdk } = await loadFirebaseSdk();
  const provider = new authSdk.GoogleAuthProvider();
  const credential = await authSdk.signInWithPopup(auth, provider);

  return credential.user.getIdToken();
};

export const loginWithMicrosoft = async () => {
  const { auth, authSdk } = await loadFirebaseSdk();
  const provider = new authSdk.OAuthProvider('microsoft.com');
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await authSdk.signInWithPopup(auth, provider);

  return credential.user.getIdToken();
};
