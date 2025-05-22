import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyGateWay } from 'src/gateway/gateway';

@Module({
  providers: [UserResolver, UserService, PrismaService, MyGateWay],
})
export class UserModule {}
