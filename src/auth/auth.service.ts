import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AddUserDto } from 'src/users/dtos/add-user.dto';
import * as bcrypt from 'bcryptjs';
import { PayloadInterface } from './interfaces/payload.interface';
import { LoginUserDto } from './dtos/login-user.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    i18n: I18nService,
  ) {}

  async validateJwtUser(id: number) {
    return this.usersService.findUserById(id);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    if (!pass.length) throw new UnauthorizedException('Password is required');
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginBody: LoginUserDto) {
    const user = await this.validateUser(loginBody.email, loginBody.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadInterface = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1D' });
    return {
      access_token: accessToken,
      user,
    };
  }

  async register(registerationBody: AddUserDto) {
    const user = await this.usersService.addUser(registerationBody);
    const payload: PayloadInterface = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1D' }),
      user,
    };
  }
}
