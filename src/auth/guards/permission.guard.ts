import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/enums/permission.enum';
import { Role } from 'src/role/role.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    console.log(requiredPermissions);

    // console.log();

    const ctx = GqlExecutionContext.create(context);
    const user = await ctx.getContext().user;
    // console.log('user from permission guard', user);

    const { permissions } = await this.roleRepo.findOne({
      where: { id: user.role.id },
    });
    console.log(permissions);

    // if (requiredPermissions.length !== permissions.length) {
    //   console.log('here');
    //   return false;
    // }

    return requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );
  }
}
