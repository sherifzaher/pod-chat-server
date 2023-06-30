import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IMessageService } from './message';
import {Conversation, Message, User} from '../utils/typeorm';
import { CreateMessageParams } from '../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}
  async createMessage({
    user,
    conversationId,
    content,
  }: CreateMessageParams): Promise<Message> {
    const conversation = await this.conversationRepository.findOne(
      {
        id: conversationId,
      },
      { relations: ['creator', 'recipient'] },
    );
    console.log(conversation);

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    }

    if (
      conversation.creator.id !== user.id &&
      conversation.recipient.id !== user.id
    ) {
      throw new HttpException('Cannot create message', HttpStatus.FORBIDDEN);
    }

    conversation.recipient = instanceToPlain(conversation.recipient) as User;
    conversation.creator = instanceToPlain(conversation.creator) as User;

    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
    });

    return this.messageRepository.save(newMessage);
  }
}
