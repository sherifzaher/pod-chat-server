import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../utils/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group])],
  controllers: [GroupController],
  providers: [
    {
      provide: Services.GROUPS_SERVICE,
      useClass: GroupService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS_SERVICE,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {}
