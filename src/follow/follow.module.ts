import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { Follow } from './entities/follow.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), UsersModule],
  providers: [FollowService, FollowResolver],
  exports: [FollowService],
})
export class FollowModule {}
