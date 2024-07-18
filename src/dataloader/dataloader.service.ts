import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CommentsService } from 'src/comments/comments.service';
import { IDataloaders } from './dataloader.interface';
import { Comment } from 'src/comments/comment.entity';
import { Tweet } from 'src/tweets/tweet.entity';
import { TweetsService } from 'src/tweets/tweets.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class DataloaderService {
  constructor(
    private readonly commentsService: CommentsService,
    private tweetsService: TweetsService,
  ) {}

  getUser(req) {
    console.log(req.headers.fromAuthHeaderAsBearerToken);
  }
  getLoaders(): IDataloaders {
    const commentsDataloader = this._createCommentsLoader();
    const tweetsDataloader = this._createTweetsLoader();
    return {
      commentsDataloader,
      tweetsDataloader,
    };
  }

  private _createCommentsLoader() {
    return new DataLoader<number, Comment>(
      async (keys: readonly number[]) =>
        await this.commentsService.getUsersCommentsByBatch(keys as number[]),
    );
  }

  private _createTweetsLoader() {
    return new DataLoader<number, Tweet>(
      async (keys: readonly number[]) =>
        await this.tweetsService.getUsersTweetsByBatch(keys as number[]),
    );
  }
}
