import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PresenceGateway } from './presence.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [PrismaService, PresenceGateway],
})
export class PresenceModule {}
