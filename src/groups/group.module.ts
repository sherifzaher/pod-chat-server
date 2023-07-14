import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Services } from '../utils/constants';

@Module({
  imports: [],
  controllers: [GroupController],
  providers: [
    {
      provide: Services.GROUPS_SERVICE,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {}
