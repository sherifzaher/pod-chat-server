import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthenticationGuard } from '../auth/utils/Guards';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dtos/createConversation.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';

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
}
