import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

// Extend the Socket interface to include userId
declare module 'socket.io' {
  interface Socket {
    userId?: number;
  }
}

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('active')
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token as string;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify<{ sub: number }>(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub;
      console.log('PresenceGateway: handleConnection', userId);

      await this.prisma.user.update({
        where: { id: +userId },
        data: {
          isOnline: true,
          status: 'ONLINE',
          lastSeen: null,
          lastActivityAt: null,
        },
      });

      client.userId = userId;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('inactive')
  async handleDisconnect(client: Socket) {
    const userId = client.userId;

    if (!userId) return;

    await this.prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        isOnline: false,
        status: 'OFFLINE',
        lastSeen: new Date(),
        lastActivityAt: null,
      },
    });
    console.log('PresenceGateway: handleDisconnect', userId);
  }
  @SubscribeMessage('afk')
  async handleAfk(client: Socket) {
    const userId = client.userId;
    if (!userId) return;

    await this.prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        status: 'AWAY',
        isOnline: true,
        lastActivityAt: new Date(),
      },
    });
    console.log('PresenceGateway: handleAfk', userId);
  }
}
