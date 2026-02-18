import { Hono } from 'hono';
import { ListUsersUseCase } from '../../application/usecases/ListUsersUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';

export const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
  const userRepository = new PrismaUserRepository();
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const users = await listUsersUseCase.execute();

  return c.json({ users });
});
