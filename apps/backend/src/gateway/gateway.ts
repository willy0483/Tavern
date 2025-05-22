import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MyGateWay {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(data.room);
  }

  emitUserBanned(userId: number, banExpiresAt: Date) {
    this.server
      .to(`user_${userId}`)
      .emit('userBanned', { userId, banExpiresAt });
  }
}
