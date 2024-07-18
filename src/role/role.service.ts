import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { RoleInputDto } from './dtos/role-input.dto';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  addRole(roleInput: RoleInputDto) {
    const name = roleInput.name;
    const permissions = roleInput.permissions;
    const newRole = this.roleRepo.create({ name, permissions });
    return this.roleRepo.save(newRole);
  }
}
