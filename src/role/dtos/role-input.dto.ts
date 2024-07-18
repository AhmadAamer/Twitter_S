import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';
@InputType()
export class RoleInputDto {
  @IsString()
  @Field()
  name: string;
  @Field(() => [String])
  permissions: string[];
}
