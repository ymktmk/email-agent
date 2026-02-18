import { useMemo, useState } from 'react';
import { apiUrl } from '../lib/api';
import { loginWithGoogle, loginWithMicrosoft } from '../lib/firebase';

type LoginUser = {
  id: string;
  email: string;
  name: string;
  authProvider: 'GOOGLE' | 'MICROSOFT';
};

export const LoginPage = () => {
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<LoginUser | null>(null);
  const [integrations, setIntegrations] = useState<{ gmail: boolean; outlook: boolean }>({ gmail: false, outlook: false });

  const greeting = useMemo(() => {
    if (!user) {
      return 'Google または Microsoft でログインしてください';
    }

    return `${user.name} さんでログイン中 (${user.email}) - ${user.authProvider}`;
  }, [user]);

  const firebaseLogin = async (provider: 'google' | 'microsoft') => {
    setMessage('ログイン処理中...');

    try {
      const idToken = provider === 'google' ? await loginWithGoogle() : await loginWithMicrosoft();

      const response = await fetch(apiUrl('/api/auth/firebase-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const body = (await response.json()) as { message?: string; user?: LoginUser };

      if (!response.ok || !body.user) {
        setMessage(body.message ?? 'ログインに失敗しました。');
        return;
      }

      setUser(body.user);
      setMessage('ログインに成功しました。Gmail / Outlook 連携を行えます。');
    } catch {
      setMessage('Firebase ログインに失敗しました。設定値をご確認ください。');
    }
  };

  const startIntegration = async (provider: 'gmail' | 'outlook') => {
    if (!user) {
      setMessage('先にログインしてください。');
      return;
    }

    const response = await fetch(apiUrl(`/api/integrations/${provider}/connect`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });

    const body = (await response.json()) as { message?: string; authUrl?: string };

    if (!response.ok || !body.authUrl) {
      setMessage(body.message ?? `${provider} 連携の開始に失敗しました。`);
      return;
    }

    window.open(body.authUrl, '_blank', 'width=520,height=720');
    setIntegrations((prev) => ({ ...prev, [provider]: true }));
    setMessage(`${provider === 'gmail' ? 'Gmail' : 'Outlook'} 連携画面を開きました。認可を完了してください。`);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-6">
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">ログイン</h1>
        <p className="mt-2 text-sm text-slate-500">{greeting}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => firebaseLogin('google')}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
          >
            Google でログイン
          </button>
          <button
            onClick={() => firebaseLogin('microsoft')}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
          >
            Microsoft でログイン
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <h2 className="text-sm font-semibold text-slate-700">メールサービス連携</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => startIntegration('gmail')}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              type="button"
            >
              {integrations.gmail ? 'Gmail 連携中...' : 'Gmail を連携'}
            </button>
            <button
              onClick={() => startIntegration('outlook')}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              type="button"
            >
              {integrations.outlook ? 'Outlook 連携中...' : 'Outlook を連携'}
            </button>
          </div>
        </div>

        <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">{message || '未操作'}</p>
      </section>
    </main>
  );
};
