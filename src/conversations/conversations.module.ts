import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ParticipantsModule } from '../participants/participants.module';
import { Services } from '../utils/constants';
import { Conversation } from '../utils/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ParticipantsModule,
    UsersModule,
    TypeOrmModule.forFeature([Conversation]),
  ],
  controllers: [ConversationsController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationsService,
    },
  ],
})
export class ConversationsModule {}
