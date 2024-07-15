import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';
import { Tweet } from 'src/tweets/tweet.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 30 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 40 })
  @Field()
  email: string;

  @Column({ type: 'varchar' })
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field(() => Date)
  @CreateDateColumn()
  created_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  phoneNumber?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  country?: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    nullable: true,
  })
  @Field()
  gender?: string;

  @Field(() => [Tweet])
  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets?: Tweet[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.user)
  likes?: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: false })
  isVerified: boolean;
}
