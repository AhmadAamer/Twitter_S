import DataLoader from 'dataloader';
import { Comment } from 'src/comments/comment.entity';
import { Tweet } from 'src/tweets/tweet.entity';

export interface IDataloaders {
  commentsDataloader: DataLoader<number, Comment>;
  //   tweetsDataloader: DataLoader<number, Tweet>;
}
