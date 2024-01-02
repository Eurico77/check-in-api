import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { RegisterService } from './register';

let inMemoryRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe('Register service', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new RegisterService(inMemoryRepository);
  });

  it('should hash user password upon registration', async () => {
    const input = {
      name: 'John Doe',
      email: 'jonh@mail.com',
      password: '1234',
    };

    const { user } = await sut.execute(input);
    const isPasswordCorrectlyHashed = await compare(
      input.password,
      user.passwordHash
    );

    expect(user).toBeDefined();
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'jonh@mail.com';
    const input = {
      name: 'John Doe',
      email,
      password: '1234',
    };

    await sut.execute(input);
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserAlreadyExistsError
    );
  });

  it('should be able to register', async () => {
    const email = 'jonh@mail.com';
    const input = {
      name: 'John Doe',
      email,
      password: '1234',
    };
    const { user } = await sut.execute(input);
    expect(user).toBeDefined();
    expect(user.id).toEqual(expect.any(String));
  });
});
