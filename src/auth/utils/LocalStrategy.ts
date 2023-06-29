import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { IAuthService } from '../auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log(email, password);
    return this.authService.validateUser({ email, password });
  }
}
