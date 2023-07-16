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
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroupMessage(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: CreateMessageDto,
  ) {
    console.log(`Creating group message for ${id}`);
    const response = await this.groupMessageService.createGroupMessage({
      content,
      groupId: id,
      author: user,
    });
    this.eventEmitter.emit('group.message.create', response);
    return;
  }
}
