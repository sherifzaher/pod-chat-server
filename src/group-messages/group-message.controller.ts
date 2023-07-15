import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IGroupMessageService } from './group-message';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { Routes, Services } from '../utils/constants';
import { CreateMessageDto } from '../messages/dtos/CreateMessage.dto';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
  ) {}

  @Post()
  createGroupMessage(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: CreateMessageDto,
  ) {
    console.log(`Creating group message for ${id}`);
  }
}
