import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from 'src/users/user.entity';
@ObjectType()
export class RegisterAndSignInResponse {
  @IsString()
  @Field()
  access_token: String;
  @Field()
  user?: User;
}
