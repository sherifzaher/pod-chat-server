import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IMessageService } from './message';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/EditMessage.dto';

@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() { content }: CreateMessageDto,
    @Param('id', ParseIntPipe) conversationId: number,
  ) {
    console.log(conversationId);
    const params = { user, content, conversationId };
    const msg = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.create', msg);
    return;
  }

  @Get()
  async getConversationMessages(
    @Param('id', ParseIntPipe) conversationId: number,
    @AuthUser() user: User,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(
      conversationId,
    );

    return {
      id: conversationId,
      messages,
    };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    await this.messageService.deleteMessage({
      userId: user.id,
      conversationId,
      messageId,
    });
    this.eventEmitter.emit('message.delete', {
      userId: user.id,
      messageId,
      conversationId,
    });

    return {
      conversationId,
      messageId,
    };
  }

  // api/conversations/:conversationId/messages/:messageId
  @Patch(':messageId')
  async editMessage(
    @AuthUser() user: User,
    @Param('id') conversationId: number,
    @Param('messageId') messageId: number,
    @Body() editMessageDto: EditMessageDto,
  ) {
    const message = await this.messageService.editMessage({
      ...editMessageDto,
      conversationId,
      messageId,
      userId: user.id,
    });

    this.eventEmitter.emit('message.update', message);
    return message;
  }
}
