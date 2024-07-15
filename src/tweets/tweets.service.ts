import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { DeepPartial, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AddTweetDto } from './dtos/add-tweet.dto';

@Injectable()
export class TweetsService {
  constructor(@InjectRepository(Tweet) private tweetRepo: Repository<Tweet>) {}

  async findAllTweets(): Promise<Tweet[]> {
    return await this.tweetRepo.find({
      relations: ['user', 'tweets', 'attachments', 'likes'],
    });
  }

  async findAllTweetsByUserIds(userIds: readonly number[]): Promise<Tweet[]> {
    const tweets = await this.tweetRepo.find({
      relations: ['user'],
    });
    return tweets.filter((tweet) => userIds.includes(tweet.user.id));
  }

  async getUsersTweetsByBatch(
    userIds: readonly number[],
  ): Promise<(Tweet | any)[]> {
    const tweets = await this.findAllTweetsByUserIds(userIds);
    const mappedResults = this._mapResultToIds(userIds, tweets);
    return mappedResults;
  }

  private _mapResultToIds(userIds: readonly number[], tweets: Tweet[]) {
    return userIds.map(
      (id) => tweets.filter((tweet: Tweet) => tweet.user.id === id) || null,
    );
  }

  async findTweetById(id: number): Promise<Tweet> {
    const tweet = await this.tweetRepo.findOne({
      where: { id },
      relations: ['user', 'attachments'],
    });
    if (!tweet) throw new NotFoundException('no tweet with this id ');
    return tweet;
  }

  async addTweet(addTweetDto: AddTweetDto) {
    const newTweet = await this.tweetRepo.create(
      addTweetDto as DeepPartial<Tweet>,
    );
    return this.tweetRepo.save(newTweet);
  }
  async updateTweet(id: number, attr: Partial<Tweet>): Promise<Tweet> {
    const tweet = await this.tweetRepo.findOne({ where: { id } });
    if (!tweet) throw new NotFoundException('this tweet is not exist');
    Object.assign(tweet, attr);
    return this.tweetRepo.save(tweet);
  }
}
