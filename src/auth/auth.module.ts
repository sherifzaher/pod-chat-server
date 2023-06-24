import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Services } from '../utils/types';

@Module({
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
