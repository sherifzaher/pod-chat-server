import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from '../utils/constants';
import { IUserService } from '../users/user';

@Injectable()
export class AuthService implements IAuthService {
  constructor() {}
  validateUser() {}
}
