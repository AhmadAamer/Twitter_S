import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AddUserDto } from 'src/users/dtos/add-user.dto';
import * as bcrypt from 'bcryptjs';
import { PayloadInterface } from './interfaces/payload.interface';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateJwtUser(id: number) {
    return this.usersService.findUserById(id);
  }

  async validateUser(email: string, pass?: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(logingInBody: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(logingInBody.email);
    const payload: PayloadInterface = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  async register(registerationBody: AddUserDto) {
    const checkUser = await this.usersService.findUserByEmail(
      registerationBody.email,
    );
    if (checkUser) throw new BadRequestException('choose another email');
    const user = await this.usersService.addUser(registerationBody);
    const payload: PayloadInterface = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
