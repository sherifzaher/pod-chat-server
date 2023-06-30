import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IMessageService } from './message';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';

@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
  ) {}

  @Post()
  createMessage(
    @AuthUser() user: User,
    @Body() messageContent: CreateMessageDto,
  ) {
    return this.messageService.createMessage({ ...messageContent, user });
  }

  @Get(':conversationId')
  getConversationMessages(@Param('conversationId') conversationId: number, @AuthUser() user: User){
    return this.messageService.getMessagesByConversationId(conversationId);
  }
}
