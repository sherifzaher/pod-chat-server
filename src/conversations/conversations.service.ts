import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversations';
import { Conversation, Participant, User } from '../utils/typeorm';
import { Services } from '../utils/constants';
import { CreateConversationParams } from '../utils/types';
import { IParticipantsService } from '../participants/participants';
import { IUserService } from '../users/user';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.PARTICIPANTS)
    private readonly participantsService: IParticipantsService,
    @Inject(Services.USER)
    private readonly userService: IUserService,
  ) {}

  async find(id: number): Promise<Participant> {
    return this.participantsService.findParticipantConversations(id);
  }

  async findConversationById(id: number): Promise<Conversation> {
    return this.conversationRepository.findOne(id, {
      relations: ['participants', 'participants.user'],
    });
  }

  async createConversation(
    user: User,
    createConversationParams: CreateConversationParams,
  ) {
    const participants: Participant[] = [];
    const userDB = await this.userService.findUser({ id: user.id });

    if (!userDB.participant) {
      const participant = await this.createParticipantAndSaveUser(
        user,
        createConversationParams.authorId,
      );
      participants.push(participant);
    } else participants.push(userDB.participant);

    const recipientDB = await this.userService.findUser({
      id: createConversationParams.recipientId,
    });

    if (!recipientDB)
      throw new HttpException('Recipient not found', HttpStatus.BAD_REQUEST);

    if (!recipientDB.participant) {
      const participant = await this.createParticipantAndSaveUser(
        user,
        createConversationParams.recipientId,
      );
      participants.push(participant);
    } else participants.push(recipientDB.participant);

    const conversation = this.conversationRepository.create({ participants });
    return this.conversationRepository.save(conversation);
  }

  public async createParticipantAndSaveUser(user: User, id: number) {
    const participant = await this.participantsService.createParticipant({
      id,
    });
    user.participant = participant;
    await this.userService.saveUser(user);
    return participant;
  }
}
