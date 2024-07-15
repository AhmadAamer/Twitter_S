import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CommentsService } from 'src/comments/comments.service';
import { IDataloaders } from './dataloader.interface';
import { Comment } from 'src/comments/comment.entity';
@Injectable()
export class DataloaderService {
  constructor(private readonly commentsService: CommentsService) {}

  getLoaders(): IDataloaders {
    const commentsDataloader = this._createCommentsLoader();
    return {
      commentsDataloader,
    };
  }

  private _createCommentsLoader() {
    return new DataLoader<number, Comment>(
      async (keys: readonly number[]) =>
        await this.commentsService.getUsersCommentsByBatch(keys as number[]),
    );
  }
}

// import { Injectable } from '@nestjs/common';
// import { Friend } from '../friend/friend.entity';
// import { FriendService } from '../friend/friend.service';
// import { IDataloaders } from './dataloader.interface';

// @Injectable()
// export class DataloaderService {
//   constructor(private readonly friendService: FriendService) {}

//   getLoaders(): IDataloaders {
//     const friendsLoader = this._createFriendsLoader();
//     return {
//       friendsLoader,
//     };
//   }

//   private _createFriendsLoader() {
//     return new DataLoader<number, Friend>(
//       async (keys: readonly number[]) =>
//         await this.friendService.getStudentsFriendsByBatch(keys as number[]),
//     );
//   }
// }
