import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CreateGymService } from '../create-gym';

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymRepository();
  const service = new CreateGymService(gymsRepository);
  return service;
}
