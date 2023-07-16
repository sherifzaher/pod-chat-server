import { Group } from '../utils/typeorm';
import { CreateGroupParams, FetchGroupParams } from '../utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<Group>;
  getGroups(params: FetchGroupParams): Promise<Group[]>;
  findGroupById(id: number): Promise<Group>;
  saveGroup(params: Group): Promise<Group>;
}
