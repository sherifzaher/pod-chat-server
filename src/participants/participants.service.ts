import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IParticipantsService } from './participants';
import { Participant } from '../utils/typeorm';
import { CreateParticipantParams, FindParticipantParams } from '../utils/types';

@Injectable()
export class ParticipantsService implements IParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}
  findParticipant(params: FindParticipantParams): Promise<Participant | null> {
    return this.participantRepository.findOne(params);
  }
  createParticipant(params: CreateParticipantParams): Promise<Participant> {
    const participant = this.participantRepository.create(params);
    return this.participantRepository.save(participant);
  }

  findOrCreateParticipant() {}
}
