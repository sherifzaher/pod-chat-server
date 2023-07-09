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
import { CreateMessageResponse, DeleteMessageParams } from '../utils/types';
import { IConversationsService } from '../conversations/conversations';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.1.4:3000'],
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
    socket.emit('connected', true);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    // console.log(data);
    // console.log('Create Message');
  }

  @SubscribeMessage('onConversationJoin')
  onConversationJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onConversationJoin');
    client.join(data.conversationId);
    console.log(client.rooms);
    client.to(data.conversationId).emit('userJoin');
  }

  @SubscribeMessage('onConversationLeave')
  onConversationLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onConversationLeave');
    client.leave(data.conversationId);
    console.log(client.rooms);
    client.to(data.conversationId).emit('userLeave');
  }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onTypingStart');
    console.log(data.conversationId);
    console.log(client.rooms);
    client.to(data.conversationId).emit('onTypingStart');
    // this.server.to(data.conversationId).emit('onTypingStart');
  }

  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onUserTyping');
    console.log(data.conversationId);
    console.log(client.rooms);
    client.to(data.conversationId).emit('onTypingStop');
    // this.server.to(data.conversationId).emit('onTypingStop');
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

  @OnEvent('message.delete')
  async handleDeleteMessage(payload: DeleteMessageParams) {
    const conversation = await this.conversationService.findConversationById(
      payload.conversationId,
    );
    if (!conversation) return;

    const { creator, recipient } = conversation;
    const otherSocket =
      creator.id === payload.userId
        ? this.sessions.getSocketId(recipient.id)
        : this.sessions.getSocketId(creator.id);
    otherSocket?.emit('onMessageDelete', payload);
  }
}
