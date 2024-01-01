import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFound } from './errors/resource-not-found.error';
import { GetUserProfileService } from './get-user-profile';

let inMemoryRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get user profile service', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(inMemoryRepository);
  });

  it('should be able to get user profile', async () => {
    const input = {
      name: 'John Doe',
      email: 'jonh@mail.com',
      passwordHash: await hash('1234', 6),
    };

    const { id } = await inMemoryRepository.create({ ...input });
    const user = await inMemoryRepository.findById(id);
    expect(user).toBeDefined();
    expect(user?.name).toEqual(expect.any(String));
  });

  it('should not be able get profile if user not exists', async () => {
    expect(
      async () =>
        await sut.execute({
          userId: 'any-not-exists-id',
        })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
