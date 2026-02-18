import { Hono } from 'hono';
import { GenerateReplyMessageUseCase, type GenerateReplyMessageInput } from '../../application/usecases/GenerateReplyMessageUseCase';

export const messageRoute = new Hono();

messageRoute.post('/reply', async (c) => {
  let body: Partial<GenerateReplyMessageInput>;

  try {
    body = await c.req.json<Partial<GenerateReplyMessageInput>>();
  } catch {
    return c.json({ message: 'JSON 形式のリクエストボディを指定してください。' }, 400);
  }

  if (typeof body.receivedMessage !== 'string' || !body.receivedMessage.trim()) {
    return c.json({ message: 'receivedMessage は必須です。' }, 400);
  }

  const tone = body.tone === 'polite' || body.tone === 'casual' || body.tone === 'business' ? body.tone : undefined;

  const useCase = new GenerateReplyMessageUseCase();

  const replyMessage = useCase.execute({
    senderName: typeof body.senderName === 'string' ? body.senderName : undefined,
    receivedMessage: body.receivedMessage,
    purpose: typeof body.purpose === 'string' ? body.purpose : undefined,
    tone,
    includeSignature: body.includeSignature,
    signerName: typeof body.signerName === 'string' ? body.signerName : undefined
  });

  return c.json({ replyMessage });
});
