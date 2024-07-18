import { Field, InputType, PartialType } from '@nestjs/graphql';
import { User } from '../user.entity';
@InputType()
class UpdateUserAttrInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  gender?: string;
  @Field({ nullable: true })
  role?: number;
}

@InputType()
export class UpdateUserInput {
  @Field()
  id: number;
  @Field(() => UpdateUserAttrInput)
  attr: UpdateUserAttrInput;
}
