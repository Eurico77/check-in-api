import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInService } from './check-in-service';

let inMemoryCheckInRepository: InMemoryCheckInsRepository;
let inMemoryGymRepository: InMemoryGymRepository;
let sut: CheckInService;

describe('CheckIn service', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInsRepository();
    inMemoryGymRepository = new InMemoryGymRepository();
    sut = new CheckInService(inMemoryCheckInRepository, inMemoryGymRepository);

    await inMemoryGymRepository.create({
      id: 'gym-01',
      title: 'any title',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check-in', async () => {
    const input = {
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    };

    const { checkIn } = await sut.execute(input);

    expect(checkIn).toBeDefined();
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should  be able to check in twice in the different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    inMemoryGymRepository.gyms.push({
      id: 'gym-02',
      description: 'Javascript gym',
      latitude: new Decimal(-4.9601685),
      longitude: new Decimal(-39.0308405),
      phone: 'fake-number',
      title: 'any title',
    });

    expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -4.9678928,
        userLongitude: -39.0202477,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
