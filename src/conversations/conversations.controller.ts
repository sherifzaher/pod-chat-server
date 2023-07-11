import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthenticationGuard } from '../auth/utils/Guards';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dtos/createConversation.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticationGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    private readonly events: EventEmitter2,
  ) {}
  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.createConversation(
      user,
      createConversationDto,
    );
    this.events.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@AuthUser() { id }: User) {
    return this.conversationsService.getConversations(id);
  }

  @Get(':id')
  getConversationById(@Param('id') id: number) {
    return this.conversationsService.findConversationById(id);
  }
}
