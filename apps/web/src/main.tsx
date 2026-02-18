import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { HomePage } from './routes/home';
import './index.css';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#dbeafe_45%,_#bfdbfe)] py-6 lg:py-12">
      <Outlet />
    </div>
  )
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const routeTree = rootRoute.addChildren([homeRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
