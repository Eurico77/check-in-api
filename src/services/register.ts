import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

export async function registerService(input: Input) {
  const passwordHash = await hash(input.password, 6);
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: input.email
    }
  });
  if (userAlreadyExists) throw new Error('User alreadyExist');
  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    email: input.email,
    name: input.name,
    passwordHash
  });
}

type Input = {
  name: string;
  email: string;
  password: string;
}

