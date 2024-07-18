import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { TweetsResolver } from './tweets.resolver';
import { Role } from 'src/role/role.entity';
import { RoleModule } from 'src/role/role.module';
import { RoleService } from 'src/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, Role]), RoleModule],
  providers: [TweetsService, TweetsResolver, RoleService],
  exports: [TweetsService],
})
export class TweetsModule {}
