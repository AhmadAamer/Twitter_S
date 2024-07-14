import { Args, Mutation, PartialType, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AddUserInput } from './inputs/add-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users() {
    return await this.usersService.getAllUsers();
  }

  @Mutation(() => User)
  async addUser(
    @Args('AddUserInput') AddUserInput: AddUserInput,
  ): Promise<User> {
    return await this.usersService.addUser(AddUserInput);
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
