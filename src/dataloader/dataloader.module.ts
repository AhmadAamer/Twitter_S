import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CommentsModule } from 'src/comments/comments.module';
import { TweetsModule } from 'src/tweets/tweets.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [CommentsModule, TweetsModule, UsersModule],
  providers: [DataloaderService, UsersService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
