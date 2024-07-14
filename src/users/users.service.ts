import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AddUserDto } from './dtos/add-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async getAllUsers() {
    return await this.usersRepo.find({ relations: ['tweets', 'comments'] });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async addUser(addUserDto: AddUserDto) {
    const { name, email, password } = addUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.usersRepo.save(newUser);
  }

  async removeUser(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found!');
    return this.usersRepo.remove(user);
  }
  async updateUser(id: number, attr: Partial<User>): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('this user is not exist');
    Object.assign(user, attr);
    return this.usersRepo.save(user);
  }
}
