import { User } from '../utils/typeorm';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
  findUser(findUser: FindUserParams): Promise<User>;
}
