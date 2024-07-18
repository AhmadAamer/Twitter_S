import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
@InputType()
export class LoginUserDto {
  @IsEmail()
  @Field()
  email: string;
  @Field()
  @IsString({ message: 'invalid' })
  password: string;
}
