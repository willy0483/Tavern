import { BanUserInput } from './dto/ban-user.input';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UnbanUserInput } from './dto/unban-user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserInput: CreateUserInput) {
    const { password, ...user } = createUserInput;

    const hashedPassword = await hash(password);

    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  }

  async banUser(banUserInput: BanUserInput) {
    const { userId, minutes } = banUserInput;
    const banDuration = (minutes ?? 5) * 60 * 1000;
    const banExpiresAt = new Date(Date.now() + banDuration);
    return this.prisma.user.update({
      where: { id: userId },
      data: { banned: true, banExpiresAt },
    });
  }

  async unbanUser(unbanUserInput: UnbanUserInput) {
    const { userId } = unbanUserInput;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        banned: false,
        banExpiresAt: null,
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async unbanExpiredUsers() {
    const result = await this.prisma.user.updateMany({
      where: {
        banned: true,
        banExpiresAt: { lte: new Date() },
      },
      data: {
        banned: false,
        banExpiresAt: null,
      },
    });
    console.log('looking to unban');

    // log how many users have been unbanned
    if (result.count > 0) {
      const dkTime = new Date().toLocaleString('da-DK', {
        timeZone: 'Europe/Copenhagen',
      });
      console.log(
        `Unbanned ${result.count} user(s) at ${dkTime} (DK local time)`,
      );
    }
  }
}
