import {
  Body,
  Controller,
  Get, HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';

import { Routes, Services } from '../utils/constants';
import { AuthenticationGuard, LocalAuthGuard } from './utils/Guards';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { IUserService } from '../users/user';

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
  login(@Res() res: Response) {
    return res.send(HttpStatus.OK);
  }

  @Get('status')
  @UseGuards(AuthenticationGuard)
  status(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }

  @Post('logout')
  logout() {}
}
