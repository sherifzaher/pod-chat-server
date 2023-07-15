import { Group } from '../utils/typeorm';
import { CreateGroupParams, FetchGroupParams } from '../utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<Group>;
  getGroups(params: FetchGroupParams): Promise<Group[]>;
}
