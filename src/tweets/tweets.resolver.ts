import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TweetsService } from './tweets.service';
import { Tweet } from './tweet.entity';
import { AddTweetInput } from './inputs/add-tweet.input';
import { UpdateTweetInput } from './inputs/update-tweet.input';

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

  @Mutation(() => Tweet)
  addTweet(@Args('addTweetInput') addTweetInput: AddTweetInput) {
    return this.tweetsService.addTweet(addTweetInput);
  }

  @Mutation(() => Tweet)
  updateTweet(@Args('updateTweetInput') updateTweetInput: UpdateTweetInput) {
    const { id, attr } = updateTweetInput;
    return this.tweetsService.updateTweet(id, attr);
  }
}
