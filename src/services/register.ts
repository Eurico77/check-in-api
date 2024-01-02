import { UsersRepository } from '@/repositories/users-repository';
import type { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

export class RegisterService {
  constructor(private readonly repository: UsersRepository) {}

  async execute(input: Input): Promise<Output> {
    const passwordHash = await hash(input.password, 6);
    const userAlreadyExists = await this.repository.findByEmail(input.email);
    if (userAlreadyExists) throw new UserAlreadyExistsError();

    const user = await this.repository.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });
    return {
      user,
    };
  }
}

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = {
  user: User;
};
