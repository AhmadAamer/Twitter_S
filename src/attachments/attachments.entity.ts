import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tweet } from 'src/tweets/tweet.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Attachment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => Date)
  created_at?: Date;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field()
  url: string;

  @Field(() => Tweet)
  @ManyToOne(() => Tweet, (tweet) => tweet.attachments)
  tweet: Tweet;
}
