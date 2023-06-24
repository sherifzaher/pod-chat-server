import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes, Services } from '../utils/types';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUser.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Post('register')
  register(@Body() createUser: CreateUserDto) {}

  @Post('login')
  login() {}

  @Get('status')
  status() {}

  @Post('logout')
  logout() {}
}
