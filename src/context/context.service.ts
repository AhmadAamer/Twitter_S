import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ContextService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async getUser(req) {
    try {
      const token = req.headers?.authorization?.split(' ')[1];
      //   console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      const userId = payload.id;
      const user = await this.usersService.findUserById(userId);
      // console.log('user', user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
