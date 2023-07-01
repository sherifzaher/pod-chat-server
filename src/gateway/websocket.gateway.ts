import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MessagingGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    console.log('New Incoming Connection');
    console.log(client.id);
    client.emit('connected', true);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    // console.log(data);
    // console.log('Create Message');
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: any) {
    // console.log('hello msg');
    // console.log(payload);
    this.server.emit('onMessage', payload);
  }
}
