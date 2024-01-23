import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsService } from './search-gyms';

let inMemorySearchGymRepository: InMemoryGymRepository;
let sut: SearchGymsService;

describe('Search gyms by name service', () => {
  beforeEach(async () => {
    inMemorySearchGymRepository = new InMemoryGymRepository();
    sut = new SearchGymsService(inMemorySearchGymRepository);
  });

  it('should be able to search gym by name ', async () => {
    await inMemorySearchGymRepository.create({
      title: 'js-gym-1',
      description: null,
      phone: null,
      latitude: -4.9601685,
      longitude: -39.0308405,
    });
    await inMemorySearchGymRepository.create({
      title: 'ts-gym-1',
      description: null,
      phone: null,
      latitude: -4.9601685,
      longitude: -39.0308405,
    });

    const { gyms } = await sut.execute({
      query: 'ts-gym-1',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'ts-gym-1' })]);
  });

  it('should be able to fetch paginated gym by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemorySearchGymRepository.create({
        title: `ts-gym-${i}`,
        description: null,
        phone: null,
        latitude: -4.9601685,
        longitude: -39.0308405,
      });
    }
    const { gyms } = await sut.execute({
      query: 'ts-gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'ts-gym-21' }),
      expect.objectContaining({ title: 'ts-gym-22' }),
    ]);
  });
});
