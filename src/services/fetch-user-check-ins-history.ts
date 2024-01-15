import { CheckInsRepository } from '@/repositories/check-in-repository';
import { CheckIn } from '@prisma/client';

export class FetchUserCheckInHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute(input: Input): Promise<Output> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      input.userId,
      input.page
    );

    return {
      checkIns,
    };
  }
}

type Input = {
  userId: string;
  page: number;
};

type Output = {
  checkIns: CheckIn[];
};
