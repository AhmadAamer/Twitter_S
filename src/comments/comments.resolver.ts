import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { AddCommentInput } from './inputs/add-comment.input';

@Resolver()
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Query(() => [Comment])
  comments() {
    return this.commentsService.findAllComments();
  }

  @Mutation(() => Comment)
  addComment(@Args('addCommentInput') addcommentInput: AddCommentInput) {
    return this.commentsService.addComment(addcommentInput);
  }
}
