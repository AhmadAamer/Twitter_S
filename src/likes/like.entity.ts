import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tweet } from 'src/tweets/tweet.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Like {
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
  updated_at?: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likes)
  user?: User;
  @Field(() => Tweet)
  @ManyToOne(() => Tweet, (tweet) => tweet.likes)
  tweet?: Tweet;
}
