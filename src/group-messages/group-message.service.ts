import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { IGroupMessageService } from './group-message';
import { IGroupService } from '../groups/group';
import { Group, GroupMessage } from '../utils/typeorm';
import {
  CreateGroupMessageParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from '../utils/types';
import { Services } from '../utils/constants';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
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

  getGroupMessages(id: number): Promise<GroupMessage[]> {
    return this.groupMessageRepository.find({
      where: { group: id },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteGroupMessage(params: DeleteGroupMessageParams) {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :groupId', { groupId: params.groupId })
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('group.messages', 'messages')
      .orderBy('messages.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!group)
      throw new HttpException('Group not found', HttpStatus.BAD_REQUEST);

    const message = await this.groupMessageRepository.findOne({
      id: params.messageId,
      author: { id: params.userId },
      group: { id: params.groupId },
    });
    if (!message)
      throw new HttpException('Cannot delete message', HttpStatus.BAD_REQUEST);

    if (group.lastMessageSent.id !== message.id) {
      return this.groupMessageRepository.delete({ id: message.id });
    }

    const arrSize = group.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (arrSize <= 1) {
      console.log('Deleting the last message');
      await this.groupRepository.update(
        {
          id: group.id,
        },
        {
          lastMessageSent: null,
        },
      );
      await this.groupMessageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessageSent = group.messages[SECOND_MESSAGE_INDEX];
      console.log(newLastMessageSent);
      group.lastMessageSent = newLastMessageSent;
      await this.groupRepository.update(
        {
          id: params.groupId,
        },
        {
          lastMessageSent: newLastMessageSent,
        },
      );
      await this.groupMessageRepository.delete({ id: message.id });
    }
  }

  async editGroupMessage(params: EditGroupMessageParams) {
    const messageDB = await this.groupMessageRepository.findOne(
      {
        id: params.messageId,
        author: { id: params.userId },
      },
      {
        relations: ['author', 'group', 'group.creator', 'group.users'],
      },
    );

    if (!messageDB) {
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    }
    messageDB.content = params.content;

    return await this.groupMessageRepository.save(messageDB);
  }
}
