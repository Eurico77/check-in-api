import { GymsRepository } from '@/repositories/gyms-repository';
import type { Gym } from '@prisma/client';

export class CreateGymService {
  constructor(private readonly repository: GymsRepository) {}

  async execute(input: Input): Promise<Output> {
    const gym = await this.repository.create(input);

    return {
      gym,
    };
  }
}

type Input = {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
};

type Output = {
  gym: Gym;
};
