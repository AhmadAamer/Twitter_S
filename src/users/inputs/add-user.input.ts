import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
