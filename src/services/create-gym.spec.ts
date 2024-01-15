import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymService } from './create-gym';

let inMemoryGymRepository: InMemoryGymRepository;
let sut: CreateGymService;

describe('Create Gym service', () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository();
    sut = new CreateGymService(inMemoryGymRepository);
  });

  it('should be able create a new gym', async () => {
    const { gym } = await sut.execute({
      description: null,
      phone: null,
      title: 'any-title',
      latitude: -4.9601685,
      longitude: -39.0308405,
    });

    expect(gym.id).toBeDefined();
  });
});
