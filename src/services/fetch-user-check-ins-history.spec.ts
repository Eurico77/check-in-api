import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInHistoryService } from './fetch-user-check-ins-history';

let inMemoryCheckInRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryService;

describe('Fetch checkIn history service', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryService(inMemoryCheckInRepository);
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

    const { checkIns } = await sut.execute({
      userId: 'any-user',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-1' }),
      expect.objectContaining({ gymId: 'gym-2' }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInRepository.create({
        gymId: `gym-${i}`,
        userId: 'any-user',
      });
    }
    const { checkIns } = await sut.execute({
      userId: 'any-user',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ]);
  });
});
