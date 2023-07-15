import { Injectable } from '@nestjs/common';
import { IGroupMessageService } from './group-message';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../utils/typeorm';
import { Repository } from 'typeorm';
import {CreateGroupMessageParams} from "../utils/types";

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  createGroupMessage(params: CreateGroupMessageParams) {
    this.messageRepository.create()
  }
}
