import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  return credential.user.getIdToken();
};

export const loginWithMicrosoft = async () => {
  const provider = new OAuthProvider('microsoft.com');
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);

  return credential.user.getIdToken();
};
