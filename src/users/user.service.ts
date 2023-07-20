import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from './user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/helpers';
import {
  CreateUserDetails,
  FindUserOptions,
  FindUserParams,
} from '../utils/types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(userDetails: CreateUserDetails) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: userDetails.email,
      },
    });

    if (findUser) {
      throw new HttpException('User already exist.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(userDetails.password);
    const createdUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
    });
    return this.userRepository.save(createdUser);
  }

  findUser(findUser: FindUserParams, options?: FindUserOptions): Promise<User> {
    const selection: (keyof User)[] = ['email', 'firstName', 'lastName', 'id'];
    const selectionWithPassword: (keyof User)[] = [...selection, 'password'];
    return this.userRepository.findOne(findUser, {
      select: options?.selectAll ? selectionWithPassword : selection,
    });
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async searchUsers(param: string): Promise<User[]> {
    const statement = '(user.email LIKE :query)';
    return this.userRepository
      .createQueryBuilder('user')
      .where(statement, {
        query: `%${param}%`,
      })
      .limit(10)
      .select(['user.firstName', 'user.lastName', 'user.email', 'user.id'])
      .getMany();
  }
}
