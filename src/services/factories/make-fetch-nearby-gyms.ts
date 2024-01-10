import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { FetchNearbyGymsService } from '../fetch-nearby-gyms';

export function makeFetchNearbyGymsService() {
  const gymsRepository = new PrismaGymRepository();
  const service = new FetchNearbyGymsService(gymsRepository);
  return service;
}
