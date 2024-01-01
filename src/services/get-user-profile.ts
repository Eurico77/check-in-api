import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { ResourceNotFound } from './errors/resource-not-found.error';

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.usersRepository.findById(input.userId);
    if (!user) throw new ResourceNotFound();

    return {
      user,
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  user: User;
};
