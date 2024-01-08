import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInService } from '../check-in-service';

export function makeCheckInUseService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymRepository();
  const service = new CheckInService(checkInsRepository, gymsRepository);
  return service;
}
