import { Link } from '@tanstack/react-router';

export const SignupPage = () => {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-6">
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">新規登録</h1>
        <p className="mt-2 text-sm text-slate-500">本アプリは Firebase Authentication を利用するため、Google / Microsoft アカウントで登録します。</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link
            to="/login"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Google で登録
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Microsoft で登録
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          すでにアカウントをお持ちですか？{' '}
          <Link to="/login" className="font-semibold text-sky-700 hover:underline">
            ログインへ
          </Link>
        </p>
      </section>
    </main>
  );
};
