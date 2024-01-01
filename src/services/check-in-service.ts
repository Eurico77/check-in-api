import { CheckInsRepository } from '@/repositories/check-in-repository';
import { CheckIn } from '@prisma/client';

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute(input: Input): Promise<Output> {
    const checkIn = await this.checkInsRepository.create({
      gymId: input.gymId,
      userId: input.userId,
    });

    return {
      checkIn,
    };
  }
}

type Input = {
  userId: string;
  gymId: string;
};

type Output = {
  checkIn: CheckIn;
};
