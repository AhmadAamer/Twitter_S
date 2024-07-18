import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from './role.entity';
import { RoleInputDto } from './dtos/role-input.dto';
import { RoleService } from './role.service';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleservice: RoleService) {}
  @Mutation(() => Role)
  async addRole(@Args('roleInput') roleInput: RoleInputDto) {
    return await this.roleservice.addRole(roleInput);
  }
}
