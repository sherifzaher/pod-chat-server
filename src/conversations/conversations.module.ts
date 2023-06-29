import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { Services } from '../utils/constants';
import { ConversationsService } from './conversations.service';

@Module({
  controllers: [ConversationsController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationsService,
    },
  ],
})
export class ConversationsModule {}
