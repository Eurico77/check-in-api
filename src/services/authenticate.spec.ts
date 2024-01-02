import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateService } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

let inMemoryRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Authenticate service', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(inMemoryRepository);
  });
  it('should hash user password upon registration', async () => {
    const input = {
      name: 'John Doe',
      email: 'jonh@mail.com',
      passwordHash: await hash('1234', 6),
    };

    await inMemoryRepository.create({ ...input });
    const { user } = await sut.execute({
      email: input.email,
      password: '1234',
    });

    expect(user).toBeDefined();
  });

  it('should not be able authenticate with wrong email', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'mail-invalid',
          password: '1234',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able authenticate with wrong password', async () => {
    const inMemoryRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryRepository);

    const input = {
      name: 'John Doe',
      email: 'jonh@mail.com',
      passwordHash: await hash('1234', 6),
    };
    await inMemoryRepository.create({ ...input });

    expect(
      async () =>
        await sut.execute({
          email: 'mail-invalid',
          password: '12348',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
