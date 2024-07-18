import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AddUserDto } from './dtos/add-user.dto';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async getAllUsers() {
    return await this.usersRepo.find({
      relations: ['followers', 'followings', 'role'],
    });
  }
  async getAdmins() {
    const roleAdmin = await this.rolesRepo.findOne({
      where: { name: 'admin' },
    });
    console.log(roleAdmin.id);

    const admins = await this.usersRepo.find({
      where: {},
      relations: ['role'],
    });

    return admins;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.usersRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async addUser(addUserDto: AddUserDto) {
    const { name, email, password } = addUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const exist = await this.usersRepo.findOne({ where: { email } });
    if (exist) throw new BadRequestException('choose another email');

    const newUser = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.usersRepo.save(newUser);
  }

  async removeUser(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return await this.usersRepo.remove(user);
  }
  async updateUser(id: number, attr: Partial<User>): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('this user is not exist');
    Object.assign(user, attr);
    return this.usersRepo.save(user);
  }
}
