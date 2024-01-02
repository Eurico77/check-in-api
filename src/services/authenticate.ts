import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await compare(
      input.password,
      user.passwordHash
    );

    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return {
      user,
    };
  }
}

type Input = {
  email: string;
  password: string;
};
type Output = {
  user: User;
};
