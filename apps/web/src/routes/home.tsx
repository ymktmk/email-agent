import { useQuery } from '@tanstack/react-query';

const fetchHealth = async (): Promise<{ status: string; service: string }> => {
  const response = await fetch('http://localhost:8787/api/health');
  if (!response.ok) {
    throw new Error('Failed to fetch health check');
  }
  return response.json();
};

export const HomePage = () => {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    retry: false
  });

  return (
    <main className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-medium">Frontend Baseline</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>React + Vite + TypeScript</li>
          <li>TanStack Router for routing</li>
          <li>TanStack Query for server state</li>
          <li>Tailwind CSS for styling</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-medium">API Health Check</h2>
        <p className="mt-2 text-slate-300">
          {healthQuery.isLoading && 'Loading...'}
          {healthQuery.isError && 'API connection failed. Start backend on :8787'}
          {healthQuery.data && `${healthQuery.data.service}: ${healthQuery.data.status}`}
        </p>
      </section>
    </main>
  );
};
