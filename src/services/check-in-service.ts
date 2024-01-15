import { CheckInsRepository } from '@/repositories/check-in-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { CheckIn } from '@prisma/client';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberCheckIndError } from './errors/max-number-of-check-ins-error';

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    const MAX_DISTANCE = 0.1;

    const gym = await this.gymsRepository.findById(input.gymId);
    if (!gym) throw new MaxNumberCheckIndError();

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: input.userLatitude,
        longitude: input.userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    if (distance > MAX_DISTANCE) throw new MaxDistanceError();

    const checkInAlreadyExist =
      await this.checkInsRepository.findByUserIdOnDate(
        input.userId,
        new Date()
      );

    if (checkInAlreadyExist) throw new Error();

    const checkIn = await this.checkInsRepository.create({
      ...input,
    });

    return {
      checkIn,
    };
  }
}

type Input = {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
};

type Output = {
  checkIn: CheckIn;
};
