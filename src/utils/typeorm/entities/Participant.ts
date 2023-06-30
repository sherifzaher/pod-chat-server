import { Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Conversation } from './Conversation';

@Entity({ name: 'participants' })
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  @JoinTable()
  conversations: Conversation[];
}
