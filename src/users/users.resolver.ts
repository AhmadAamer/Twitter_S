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
import { UserGuard } from 'src/auth/guards/user-guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/enums/permission.enum';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';

export const GqlUserResponse = generateGqlResponse(User);
export const GqlUsersResponse = generateGqlResponse(Array(User), true);

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.ViewAllUsers)
  @UseGuards(PermissionsGuard)
  @Query(() => GqlUsersResponse)
  async users() {
    const users = await this.usersService.getAllUsers();
    return {
      status: 'success',
      message: 'users fetched successfully',
      data: users,
    };
  }

  @Query(() => String)
  async admins() {
    return await this.usersService.getAdmins();
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.ViewAllUsers)
  @UseGuards(PermissionsGuard)
  @Query(() => GqlUserResponse)
  async user(@Args('id') id: number) {
    const user = await this.usersService.findUserById(id);
    return {
      status: 'success',
      message: 'user fetched successfully',
      data: user,
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
  async removeUser(@Args('userId') userId: number) {
    const user = await this.usersService.removeUser(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') input: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.updateUser(input.id, input.attr);
  }
}
