import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IMessageService } from './message';
import { Conversation, Message, User } from '../utils/typeorm';
import {
  CreateMessageParams,
  CreateMessageResponse,
  DeleteMessageParams,
  EditMessageParams,
} from '../utils/types';
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
  }: CreateMessageParams): Promise<CreateMessageResponse> {
    const conversation = await this.conversationRepository.findOne(
      {
        id: conversationId,
      },
      { relations: ['creator', 'recipient', 'lastMessageSent'] },
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

    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    const updateConversation = await this.conversationRepository.save(
      conversation,
    );
    return {
      message: savedMessage,
      conversation: updateConversation,
    };
  }

  getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        conversation: {
          id: conversationId,
        },
      },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteMessage(params: DeleteMessageParams) {
    console.log(params);
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :conversationId', { conversationId: params.conversationId })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :conversationId', {
        conversationId: params.conversationId,
      })
      .orderBy('message.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!conversation)
      throw new HttpException('Conversation not Found', HttpStatus.BAD_REQUEST);

    const message = await this.messageRepository.findOne({
      id: params.messageId,
      author: { id: params.userId },
    });

    if (!message)
      throw new HttpException('Cannot delete message', HttpStatus.FORBIDDEN);

    // Check if it's not the last message in conversation
    if (conversation.lastMessageSent.id !== message.id) {
      return await this.messageRepository.delete({ id: message.id });
    }

    // if it's the last message in conversation
    const arrSize = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (arrSize <= 1) {
      console.log('Deleting the last message');
      await this.conversationRepository.update(
        {
          id: conversation.id,
        },
        {
          lastMessageSent: null,
        },
      );
      await this.messageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessageSent = conversation.messages[SECOND_MESSAGE_INDEX];
      console.log(newLastMessageSent);
      conversation.lastMessageSent = newLastMessageSent;
      await this.conversationRepository.update(
        {
          id: params.conversationId,
        },
        {
          lastMessageSent: newLastMessageSent,
        },
      );
      await this.messageRepository.delete({ id: message.id });
    }
  }

  async editMessage(params: EditMessageParams): Promise<Message> {
    const messageDB = await this.messageRepository.findOne(
      {
        id: params.messageId,
        author: { id: params.userId },
      },
      {
        relations: [
          'author',
          'conversation',
          'conversation.creator',
          'conversation.recipient',
        ],
      },
    );

    if (!messageDB) {
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    }
    messageDB.content = params.content;

    return await this.messageRepository.save(messageDB);
  }
}
