import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddCommentInput {
  @Field()
  content?: string;
  @Field()
  user?: number;
  @Field()
  tweet?: number;
}
