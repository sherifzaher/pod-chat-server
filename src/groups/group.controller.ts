import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IGroupService } from './group';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateGroupDto } from './dtos/CreateGroup.dto';

@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS_SERVICE)
    private readonly groupService: IGroupService,
  ) {}

  @Post()
  async createGroup(
    @AuthUser() user: User,
    @Body() createGroupPayload: CreateGroupDto,
  ) {
    return this.groupService.createGroup({
      ...createGroupPayload,
      creator: user,
    });
  }

  @Get()
  async getGroups(@AuthUser() user: User) {
    const data = await this.groupService.getGroups({ userId: user.id });
    console.log(data);
    return data;
  }
}
