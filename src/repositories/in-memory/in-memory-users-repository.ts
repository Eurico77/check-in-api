import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  constructor() {
    this.users = [];
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async create({ email, name, passwordHash }: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      email,
      name,
      passwordHash,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }
}
