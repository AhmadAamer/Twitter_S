import { IsString } from 'class-validator';
export class AddTweetDto {
  @IsString()
  content?: string;
  user?: number;
}
