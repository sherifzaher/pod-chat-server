import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../utils/interfaces';
import { Inject } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IGatewaySession } from './gateway.session';
import { Message } from '../utils/typeorm';
import {CreateMessageResponse} from "../utils/types";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySession,
  ) {}
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('New Incoming Connection');
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', true);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    // console.log(data);
    // console.log('Create Message');
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    const {
      author,
      conversation: { creator, recipient },
    } = payload.message;
    const authorSocket = this.sessions.getSocketId(author.id);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getSocketId(recipient.id)
        : this.sessions.getSocketId(creator.id);

    recipientSocket?.emit('onMessage', payload);
    authorSocket?.emit('onMessage', payload);
  }
}
