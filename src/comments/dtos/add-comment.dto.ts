import { IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  content?: string;
  user?: number;
  tweet?: number;
}
