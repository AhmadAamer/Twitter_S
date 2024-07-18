import { InputType, Field } from '@nestjs/graphql';
import { Role } from 'src/role/role.entity';

@InputType()
export class AddUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
