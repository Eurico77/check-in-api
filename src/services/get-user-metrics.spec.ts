import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsService } from './get-user-metrics';

let inMemoryCheckInRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe('get user checkIn metrics service', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(inMemoryCheckInRepository);
  });

  it('should be able to fetch check-in history', async () => {
    await inMemoryCheckInRepository.create({
      gymId: 'gym-1',
      userId: 'any-user',
    });
    await inMemoryCheckInRepository.create({
      gymId: 'gym-2',
      userId: 'any-user',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'any-user',
    });

    expect(checkInsCount).toEqual(2);
  });
});
