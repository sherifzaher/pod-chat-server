import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: ['insert', 'remove', 'update'],
  })
  messages: Message[];

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;
}
