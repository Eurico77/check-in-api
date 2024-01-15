import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../check-in-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkIns: CheckIn[] = [];

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.userId === userId).length;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkIns
      .filter((checkIn) => checkIn.userId === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date');
    const endOfDay = dayjs(date).endOf('date');

    const findCheckInByDate = await this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt);
      const inOnSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.userId === userId && inOnSameDate;
    });

    if (!findCheckInByDate) {
      return null;
    }

    return findCheckInByDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      createdAt: new Date(),
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }
}
