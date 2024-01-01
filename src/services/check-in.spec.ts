import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckInService } from './check-in-service';

let inMemoryRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe('CheckIn service', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(inMemoryRepository);
  });
  it('should be able to check-in', async () => {
    const input = {
      gymId: 'gym-01',
      userId: 'user-01',
    };

    const { checkIn } = await sut.execute(input);

    expect(checkIn).toBeDefined();
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
