import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
  following: User;
}
