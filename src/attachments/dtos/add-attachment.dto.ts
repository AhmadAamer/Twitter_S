import { IsString } from 'class-validator';

export class addAttachmentDto {
  @IsString()
  url: string;
  @IsString()
  type: string;
  @IsString()
  tweet?: number;
}
