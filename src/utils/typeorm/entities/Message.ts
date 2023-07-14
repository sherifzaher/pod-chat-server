import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Conversation } from './Conversation';
import {GroupConversation} from "./GroupConversation";

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.messages)
  author: User;

  @ManyToOne(() => Conversation, (conversations) => conversations.messages)
  conversation: Conversation;

  @ManyToOne(() => GroupConversation, (groupConversation) => groupConversation.messages)
  group?: GroupConversation;

}
