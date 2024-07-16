import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { generateGqlResponse } from 'src/utils/gql-general-res';

//generate responses..
export const GqlFollowResponse = generateGqlResponse(Follow);
export const GqlFollowsResponse = generateGqlResponse(Array(Follow), true);

@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}
  @Query(() => GqlFollowsResponse)
  async follows() {
    return await this.followService.findAll();
  }

  @Mutation(() => GqlFollowResponse)
  addFollow(@Args('createFollowInput') createFollowInput: CreateFollowInput) {
    return this.followService.addFollow(createFollowInput);
  }

  @Mutation(() => String)
  removeFollow(@Args('id') id: number) {
    return this.followService.remove(id);
  }
}
