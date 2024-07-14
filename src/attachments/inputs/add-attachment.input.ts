import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class addAttachmentInput {
  @Field()
  url: string;

  @Field()
  type: string;

  @Field()
  tweet?: number;
}
