import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsService } from './fetch-nearby-gyms';

let inMemorySearchGymRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsService;

describe('Fetch nearby gyms', () => {
  beforeEach(async () => {
    inMemorySearchGymRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsService(inMemorySearchGymRepository);
  });

  it('should be able to fetch nearby ', async () => {
    await inMemorySearchGymRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -4.9601685,
      longitude: -39.0308405,
    });
    await inMemorySearchGymRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      latitude: -27.9601685,
      longitude: -65.0308405,
    });

    const { gyms } = await sut.execute({
      userLatitude: -4.9601683,
      userLongitude: -39.0308401,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })]);
  });
});
