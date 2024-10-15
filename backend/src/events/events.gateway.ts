import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('event_from_client')
  handleMessage(@MessageBody() message: string): string {
    console.log('message', message)
    return `Message received: ${message}`;
  }

  @SubscribeMessage('cursor_position')
  handleCursorPosition(@MessageBody() data: { userId: string; x: number; y: number }) {
    this.server.emit('broadcast_cursor_position', data);
  }
}
