import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CommentsModule } from 'src/comments/comments.module';
import { TweetsModule } from 'src/tweets/tweets.module';

@Module({
  imports: [CommentsModule, TweetsModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
