import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { Services } from '../utils/constants';
import { Participant } from '../utils/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  controllers: [ParticipantsController],
  providers: [
    {
      provide: Services.PARTICIPANTS,
      useClass: ParticipantsService,
    },
  ],
  exports: [
    {
      provide: Services.PARTICIPANTS,
      useClass: ParticipantsService,
    },
  ],
})
export class ParticipantsModule {}
