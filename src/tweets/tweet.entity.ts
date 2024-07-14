import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Attachment } from 'src/attachments/attachments.entity';
import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';
import { User } from 'src/users/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Tweet {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => Date)
  @CreateDateColumn()
  created_at?: Date;

  @Column({ nullable: true })
  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfLikes?: number;

  @Column({ default: 0 })
  @Field(() => Int)
  numberOfComments?: number;

  @Column()
  @Field()
  content?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tweets)
  user?: User;

  @Field(() => [Attachment])
  @OneToMany(() => Attachment, (attachment) => attachment.tweet)
  attachments?: Attachment[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.tweet)
  comments?: Comment[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.tweet)
  likes?: Like[];
}
