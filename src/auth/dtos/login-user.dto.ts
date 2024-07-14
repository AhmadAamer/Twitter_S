import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
@InputType()
export class LoginUserDto {
  @IsString()
  @Field()
  email: string;
  @Field()
  @IsString()
  password: string;
}
