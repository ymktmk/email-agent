import { createHmac } from 'node:crypto';

const getSecret = () => process.env.OAUTH_STATE_SECRET ?? 'local-dev-secret';

export const signOAuthState = (payload: string) => {
  const signature = createHmac('sha256', getSecret()).update(payload).digest('base64url');

  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
};

export const verifyOAuthState = (token: string) => {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  const expected = createHmac('sha256', getSecret()).update(payload).digest('base64url');

  if (expected !== signature) {
    return null;
  }

  return payload;
};
