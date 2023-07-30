import { Module } from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { GroupMessageController } from './group-message.controller';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from '../utils/typeorm';
import { GroupModule } from '../groups/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMessage, Group]), GroupModule],
  controllers: [GroupMessageController],
  providers: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
  ],
})
export class GroupMessageModule {}
