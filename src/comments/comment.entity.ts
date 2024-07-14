import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Attachment } from 'src/attachments/attachments.entity';
import { Like } from 'src/likes/like.entity';
import { Tweet } from 'src/tweets/tweet.entity';
import { User } from 'src/users/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => Date)
  @CreateDateColumn()
  created_at?: Date;

  @Column()
  @Field()
  content?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user?: User;

  @Field(() => Tweet)
  @ManyToOne(() => Tweet, (tweet) => tweet.comments)
  tweet?: Tweet;
}
