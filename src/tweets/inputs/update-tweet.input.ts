import { Field, InputType, Int } from '@nestjs/graphql';
import { Tweet } from '../tweet.entity';
@InputType()
export class UpdateTweetAttrInput {
  @Field({ nullable: true })
  numberOfLikes?: number;

  @Field({ nullable: true })
  numberOfComments?: number;

  @Field({ nullable: true })
  content?: string;
}

@InputType()
export class UpdateTweetInput {
  @Field()
  id: number;
  @Field()
  attr?: UpdateTweetAttrInput;
}
