import type { User } from '../../domain/entities/User';
import type { UserRepository } from '../../domain/entities/UserRepository';
import { prisma } from '../prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return users;
  }
}
