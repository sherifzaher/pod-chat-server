import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthenticationGuard } from '../auth/utils/Guards';
import { IConversationsService } from './conversations';
import {CreateConversationDto} from "./dtos/createConversation.dto";

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticationGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}
  @Post()
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    this.conversationsService.createConversation(createConversationDto);
  }
}
