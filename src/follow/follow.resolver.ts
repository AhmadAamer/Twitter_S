import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { generateGqlResponse } from 'src/utils/gql-general-res';

export const GqlFollowResponse = generateGqlResponse(Follow);
export const GqlFollowsResponse = generateGqlResponse(Array(Follow), true);
@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => GqlFollowResponse)
  createFollow(
    @Args('createFollowInput') createFollowInput: CreateFollowInput,
  ) {
    return this.followService.create(createFollowInput);
  }

  @Query(() => GqlFollowsResponse)
  async follows() {
    const res = await this.followService.findAll();
    console.log(res);
    return res;
  }

  @Query(() => GqlFollowResponse)
  follow(@Args('id') id: number) {
    return this.followService.findOne(id);
  }

  @Mutation(() => String)
  removeFollow(@Args('id') id: number) {
    return this.followService.remove(id);
  }
}
