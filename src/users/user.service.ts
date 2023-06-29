import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from './user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/helpers';

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

  findUser(findUser: FindUserParams): Promise<User> {
    return this.userRepository.findOne({
      where: findUser,
    });
  }
}
