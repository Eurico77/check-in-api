import { GymsRepository } from '@/repositories/gyms-repository';
import type { Gym } from '@prisma/client';

export class SearchGymsService {
  constructor(private readonly repository: GymsRepository) {}

  async execute(input: Input): Promise<Output> {
    const gyms = await this.repository.searchManyByName(
      input.query,
      input.page
    );

    return {
      gyms,
    };
  }
}

type Input = {
  query: string;
  page: number;
};

type Output = {
  gyms: Gym[];
};
