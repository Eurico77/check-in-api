import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { GymsRepository } from '../gyms-repository';

export class InMemoryGymRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findManyNearby(params: {
    userLatitude: number;
    userLongitude: number;
  }) {
    return this.gyms.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.userLatitude,
          longitude: params.userLongitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }
  async searchManyByName(query: string, page: number) {
    return this.gyms
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);
    return gym;
  }

  async findById(id: string) {
    return this.gyms.find((gym) => gym.id === id) ?? null;
  }
}
