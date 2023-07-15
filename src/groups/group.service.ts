import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from './group';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupParams } from '../utils/types';
import { Services } from '../utils/constants';
import { IUserService } from '../users/user';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USER)
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
}
