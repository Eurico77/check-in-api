import { CheckInsRepository } from '@/repositories/check-in-repository';

export class GetUserMetricsService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute(input: Input): Promise<Output> {
    const checkInsCount = await this.checkInsRepository.countByUserId(
      input.userId
    );

    return {
      checkInsCount,
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  checkInsCount: number;
};
