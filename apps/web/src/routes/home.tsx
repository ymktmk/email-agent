import { Link } from '@tanstack/react-router';

export const HomePage = () => {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-6">
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">email-agent</h1>
        <p className="mt-2 text-sm text-slate-600">メール連携を開始するにはログインしてください。初めての方は新規登録から進められます。</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            to="/login"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ログイン画面へ
          </Link>
          <Link
            to="/signup"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            新規登録画面へ
          </Link>
        </div>
      </section>
    </main>
  );
};
