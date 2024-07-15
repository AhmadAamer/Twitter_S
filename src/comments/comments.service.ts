import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { DeepPartial, Repository } from 'typeorm';
import { AddCommentDto } from './dtos/add-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  findAllComments() {
    return this.commentRepo.find({ relations: ['user', 'tweet'] });
  }
  async findAllCommentsByUserIds(
    userIds: readonly number[],
  ): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      relations: ['user', 'tweet'],
    });
    return comments.filter((comment) => userIds.includes(comment.user.id));
  }

  async getUsersCommentsByBatch(
    userIds: readonly number[],
  ): Promise<(Comment | any)[]> {
    const comments = await this.findAllCommentsByUserIds(userIds);
    const mappedResults = this._mapResultToIds(userIds, comments);
    return mappedResults;
  }

  private _mapResultToIds(userIds: readonly number[], comments: Comment[]) {
    return userIds.map(
      (id) =>
        comments.filter((comment: Comment) => comment.user.id === id) || null,
    );
  }
  // public async getStudentsFriendsByBatch(
  //   studentIds: readonly number[],
  // ): Promise<(Friend | any)[]> {
  //   const friends = await this.getAllFriendsByStudentIds(studentIds);
  //   const mappedResults = this._mapResultToIds(studentIds, friends);
  //   return mappedResults;
  // }

  // private _mapResultToIds(studentIds: readonly number[], friends: Friend[]) {
  //   return studentIds.map(
  //     (id) =>
  //       friends.filter((friend: Friend) => friend.studentId === id) || null,
  //   );
  // }

  async addComment(addCommentDto: AddCommentDto) {
    const newComment = await this.commentRepo.create(
      addCommentDto as DeepPartial<Comment>,
    );
    return this.commentRepo.save(newComment);
  }
}
