import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddTweetInput {
  @Field()
  content?: string;
  @Field()
  user?: number;
}
