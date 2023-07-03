import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../utils/interfaces';
import { Inject } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IGatewaySession } from './gateway.session';
import { Conversation, Message } from '../utils/typeorm';
import { CreateMessageResponse } from '../utils/types';
import { IConversationsService } from '../conversations/conversations';

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
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('New Incoming Connection');
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.join('hello-world-room');
    console.log(socket.rooms);
    socket.emit('connected', true);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    // console.log(data);
    // console.log('Create Message');
  }

  @SubscribeMessage('onUserTyping')
  async handleUserTyping(@MessageBody() data: any) {
    const id = parseInt(data.conversationId);
    const conversation = await this.conversationService.findConversationById(
      id,
    );
    console.log(conversation);
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

  @OnEvent('conversation.create')
  handleCreateConversation(payload: Conversation) {
    const recipientSocket = this.sessions.getSocketId(payload.recipient.id);
    recipientSocket?.emit('onConversation', payload);
  }
}
