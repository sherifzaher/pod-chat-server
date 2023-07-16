import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGroupMessageService } from './group-message';
import { IGroupService } from '../groups/group';
import { GroupMessage } from '../utils/typeorm';
import { CreateGroupMessageParams } from '../utils/types';
import { Services } from '../utils/constants';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @Inject(Services.GROUPS_SERVICE)
    private readonly groupService: IGroupService,
  ) {}
  async createGroupMessage(params: CreateGroupMessageParams) {
    const { content, author } = params;

    const group = await this.groupService.findGroupById(params.groupId);
    if (!group)
      throw new HttpException('No Group Found', HttpStatus.BAD_REQUEST);

    const findUser = group.users.find((u) => u.id === author.id);
    if (!findUser)
      throw new HttpException('User not in group', HttpStatus.BAD_REQUEST);

    const groupMessage = this.groupMessageRepository.create({
      group,
      content,
      author: instanceToPlain(params.author),
    });

    const saveGroupMessage = await this.groupMessageRepository.save(
      groupMessage,
    );
    group.lastMessageSent = saveGroupMessage;

    const updatedGroup = await this.groupService.saveGroup(group);

    return { message: saveGroupMessage, group: updatedGroup };
  }
}
