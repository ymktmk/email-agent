import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { usersRoute } from './presentation/routes/users';
import { authRoute } from './presentation/routes/auth';
import { integrationRoute } from './presentation/routes/integrations';

const app = new Hono();

app.use('/*', cors());

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'email-agent-api' });
});

app.route('/api/users', usersRoute);
app.route('/api/auth', authRoute);
app.route('/api/integrations', integrationRoute);

const port = 8787;

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${info.port}`);
  }
);
