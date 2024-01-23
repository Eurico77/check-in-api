import { Gym, Prisma } from '@prisma/client';

type FindManyNearbyParams = {
  userLatitude: number;
  userLongitude: number;
};

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  searchManyByName(query: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
