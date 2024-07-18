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
import { getConnection } from 'typeorm';
import { generateVerificationToken } from 'src/utils/verification-token';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private emailService: EmailService,
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
  // async register(registerationBody: AddUserDto) {
  //   const connection = getConnection();
  //   const queryRunner = connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const user = await this.usersService.addUser(
  //       registerationBody,
  //       queryRunner,
  //     );

  //     const payload: PayloadInterface = { id: user.id };
  //     const accessToken = this.jwtService.sign(payload, { expiresIn: '1D' });

  //     const token = generateVerificationToken(user.email);
  //     console.log(token);

  //     const verificationUrl = `http://localhost:3000/graphql`;
  //     await this.emailService.sendMail(
  //       user.email,
  //       'Verify your email',
  //       `your token is ${token} , Verify it here .. ${verificationUrl}`,
  //     );

  //     await queryRunner.commitTransaction();
  //     return {
  //       access_token: accessToken,
  //       user,
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new Error('Registration failed');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
