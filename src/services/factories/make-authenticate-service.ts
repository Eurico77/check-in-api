import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateService } from '../authenticate';

export function makeAuthenticateService() {
  const prismaRepository = new PrismaUsersRepository();
  const authenticateService = new AuthenticateService(prismaRepository);
  return authenticateService;
}
