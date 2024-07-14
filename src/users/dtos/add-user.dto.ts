import { IsString, IsEmail } from 'class-validator';

export class AddUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
