import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { TweetsResolver } from './tweets.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  providers: [TweetsService, TweetsResolver],
})
export class TweetsModule {}
