import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IUserService } from './user';

@Controller(Routes.USER)
export class UserController {
  constructor(@Inject(Services.USER) userService: IUserService) {}
}
