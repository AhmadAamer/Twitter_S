import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddUserOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name?: string;

  @Field()
  email?: string;
}
