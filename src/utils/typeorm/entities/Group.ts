import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
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

  @Column({ nullable: true })
  title?: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.group, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  messages: Message[];

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;
}
