import { CheckInsRepository } from '@/repositories/check-in-repository';
import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFound } from './errors/resource-not-found.error';

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute(input: Input): Promise<Output> {
    const checkIn = await this.checkInsRepository.findById(input.checkInId);
    if (!checkIn) throw new ResourceNotFound();

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidationError();

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);
    return {
      checkIn,
    };
  }
}

type Input = {
  checkInId: string;
};

type Output = {
  checkIn: CheckIn;
};
