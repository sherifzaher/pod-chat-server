import {
  Body,
  Controller,
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
import { Participant, User } from '../utils/typeorm';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticationGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}
  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(
      user,
      createConversationDto,
    );
  }

  @Get()
  async getConversations(@AuthUser() user: User) {
    const { id } = user.participant;
    const participant: Participant = await this.conversationsService.find(id);
    return participant.conversations.map((conversation) => ({
      ...conversation,
      recipient: conversation.participants.find((p) => p.user.id !== user.id),
    }));
  }

  @Get(':id')
  getConversationById(@Param('id') id: number) {
    console.log(id);
    return this.conversationsService.findConversationById(id);
  }
}
