import { Injectable } from '@nestjs/common';
import { IConversationsService } from './conversations';

@Injectable()
export class ConversationsService implements IConversationsService {
  createConversation(params: CreateConversationParams) {

  }
}
