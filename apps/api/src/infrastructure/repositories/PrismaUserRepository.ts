import type { User } from '../../domain/entities/User';
import type { UserRepository } from '../../domain/entities/UserRepository';
import { prisma } from '../prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }
}
