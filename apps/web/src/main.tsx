import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { HomePage } from './routes/home';
import { LoginPage } from './routes/login';
import { SignupPage } from './routes/signup';
import { DebugPage } from './routes/debug';
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage
});

const debugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/debug',
  component: DebugPage
});

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, signupRoute, debugRoute]);

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
