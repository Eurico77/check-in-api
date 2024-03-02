import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsService } from '../search-gyms';

export function makeSearchGymsService() {
  const gymsRepository = new PrismaGymRepository();
  const service = new SearchGymsService(gymsRepository);
  return service;
}
