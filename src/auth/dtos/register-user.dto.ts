import { IsEmail, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@InputType()
export class RegisterUserDto {
  @IsString()
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;
}
