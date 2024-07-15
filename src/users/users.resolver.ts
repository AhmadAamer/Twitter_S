import {
  Args,
  Context,
  Mutation,
  Parent,
  PartialType,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AddUserInput } from './inputs/add-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { Comment } from 'src/comments/comment.entity';
import { IDataloaders } from 'src/dataloader/dataloader.interface';
import { generateGqlResponse } from 'src/utils/gql-general-res';
import { Tweet } from 'src/tweets/tweet.entity';

export const GqlUserResponse = generateGqlResponse(User);
export const GqlUsersResponse = generateGqlResponse(Array(User), true);

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => GqlUsersResponse)
  async users() {
    const users = await this.usersService.getAllUsers();
    return {
      status: 'success',
      message: 'users fetched successfully',
      data: users,
    };
  }

  //?Check
  @ResolveField('comments', () => [Comment])
  getComments(
    @Parent() user: User,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    const { id: userId } = user;
    return loaders.commentsDataloader.load(userId);
  }

  @ResolveField('tweets', () => [Tweet])
  getTweets(
    @Parent() user: User,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    const { id: userId } = user;
    return loaders.tweetsDataloader.load(userId);
  }

  @Mutation(() => GqlUserResponse)
  async addUser(@Args('AddUserInput') AddUserInput: AddUserInput) {
    const user = await this.usersService.addUser(AddUserInput);
    return {
      status: 'success',
      message: 'user added successfully',
      data: user,
    };
  }

  @Mutation(() => User)
  async removeUser(@Args('userId') userId: number): Promise<User> {
    return await this.usersService.removeUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') input: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.updateUser(input.id, input.attr);
  }
}
