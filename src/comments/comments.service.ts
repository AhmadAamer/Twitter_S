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
  async addComment(addCommentDto: AddCommentDto) {
    const newComment = await this.commentRepo.create(
      addCommentDto as DeepPartial<Comment>,
    );
    return this.commentRepo.save(newComment);
  }
}
