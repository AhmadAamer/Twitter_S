import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [CommentsModule],
  providers: [DataloaderService],
  exports: [DataloaderModule],
})
export class DataloaderModule {}
