import { User } from '../utils/typeorm';
import { CreateUserDetails, FindUserParams } from '../utils/types';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
  findUser(findUser: FindUserParams): Promise<User>;
  saveUser(user: User): Promise<User>;
}
