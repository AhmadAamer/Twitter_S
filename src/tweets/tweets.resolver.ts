import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TweetsService } from './tweets.service';
import { Tweet } from './tweet.entity';
import { AddTweetInput } from './inputs/add-tweet.input';
import { UpdateTweetInput } from './inputs/update-tweet.input';
import { Permission } from 'src/enums/permission.enum';
import { Permissions } from 'src/decorators/permissions.decorator';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';

@Resolver()
export class TweetsResolver {
  constructor(private tweetsService: TweetsService) {}

  @Query(() => [Tweet])
  tweets() {
    return this.tweetsService.findAllTweets();
  }

  @Query(() => Tweet)
  tweet(@Args('id') id: number) {
    return this.tweetsService.findTweetById(id);
  }

  @Permissions(Permission.CreateTweet)
  @UseGuards(PermissionsGuard)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tweet)
  addTweet(@Args('addTweetInput') addTweetInput: AddTweetInput) {
    return this.tweetsService.addTweet(addTweetInput);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.EditTweet)
  @UseGuards(PermissionsGuard)
  @Mutation(() => Tweet)
  updateTweet(@Args('updateTweetInput') updateTweetInput: UpdateTweetInput) {
    const { id, attr } = updateTweetInput;
    return this.tweetsService.updateTweet(id, attr);
  }
}
