import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from './group';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupParams, FetchGroupParams } from '../utils/types';
import { Services } from '../utils/constants';
import { IUserService } from '../users/user';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS)
    private readonly userServices: IUserService,
  ) {}
  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;
    const usersPromise = params.users.map((email) =>
      this.userServices.findUser({ email }),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    console.log(users);
    const group = this.groupRepository.create({ users, creator, title });
    return this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id  IN (:users)', { users: [params.userId] })
      .getMany();
  }

  findGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent'],
    });
  }

  saveGroup(params: Group): Promise<Group> {
    return this.groupRepository.save(params);
  }
}
