import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

export class FetchNearbyGymsService {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({ userLatitude, userLongitude }: Input): Promise<Output> {
    const gyms = await this.gymsRepository.findManyNearby({
      userLatitude,
      userLongitude,
    });

    return {
      gyms,
    };
  }
}

type Input = {
  userLatitude: number;
  userLongitude: number;
};

type Output = {
  gyms: Gym[];
};
