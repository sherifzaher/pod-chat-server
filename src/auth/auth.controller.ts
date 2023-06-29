import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUser.dto';
import { IUserService } from '../users/user';
import { instanceToPlain } from 'class-transformer';
import { LoginUserDto } from './dtos/loginUser.dto';
import { LocalAuthGuard } from './utils/Guards';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USER) private userService: IUserService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(this.userService.createUser(createUserDto));
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() loginUser: LoginUserDto) {}

  @Get('status')
  status() {}

  @Post('logout')
  logout() {}
}
