import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

export class RegisterService {

  constructor(private readonly repository: UsersRepository) { }

  async execute(input: Input): Promise<void> {
    const passwordHash = await hash(input.password, 6);
    const userAlreadyExists = await this.repository.findByEmail(input.email);
    if (userAlreadyExists) throw new UserAlreadyExistsError();

    await this.repository.create({
      email: input.email,
      name: input.name,
      passwordHash
    });
  }
}

type Input = {
  name: string;
  email: string;
  password: string;
}

