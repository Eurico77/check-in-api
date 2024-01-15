import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { GymsRepository } from '../gyms-repository';

export class InMemoryGymRepository implements GymsRepository {
  public gyms: Gym[] = [];

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
