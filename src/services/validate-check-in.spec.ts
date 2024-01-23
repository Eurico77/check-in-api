import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFound } from './errors/resource-not-found.error';
import { ValidateCheckInService } from './validate-check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validatedAt).toEqual(
      expect.any(Date)
    );
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    vi.advanceTimersByTime(1000 * 60 * 21);

    expect(
      async () =>
        await sut.execute({
          checkInId: createdCheckIn.id,
        })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
