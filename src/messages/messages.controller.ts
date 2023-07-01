import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IMessageService } from './message';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() messageContent: CreateMessageDto,
  ) {
    const msg = await this.messageService.createMessage({
      ...messageContent,
      user,
    });
    this.eventEmitter.emit('message.create', msg);
    return;
  }

  @Get(':conversationId')
  async getConversationMessages(
    @Param('conversationId') conversationId: number,
    @AuthUser() user: User,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(
      conversationId,
    );

    return {
      id: Number(conversationId),
      messages,
    };
  }
}
