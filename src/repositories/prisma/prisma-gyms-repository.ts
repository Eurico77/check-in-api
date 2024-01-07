import { prisma } from '@/lib/prisma';
import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';

export class PrismaGymRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async searchManyByName(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data });
    return gym;
  }

  async findManyNearby(params: {
    userLatitude: number;
    userLongitude: number;
  }) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${params.userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.userLongitude}) ) + sin( radians(${params.userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10 `;

    return gyms;
  }
}
