import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from '../utils/types';
import { AuthService } from './auth.service';
import { IAuthService } from './auth';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}
}
