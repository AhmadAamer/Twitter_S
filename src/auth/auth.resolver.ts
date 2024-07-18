import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterAndSignInResponse } from './dtos/registerAndSignIn-res.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private config: ConfigService,
  ) {}
  @Query(() => Boolean)
  async verifyEmail(@Args('token') token: string): Promise<boolean> {
    try {
      const secret = this.config.get<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret) as any;
      const email = payload.email;

      await this.usersService.verifyUser(email);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => RegisterAndSignInResponse)
  async register(
    @Args('registerBody') registerBody: RegisterUserDto,
  ): Promise<RegisterAndSignInResponse> {
    return this.authService.register(registerBody);
  }

  @Mutation(() => RegisterAndSignInResponse)
  async login(
    @Args('loginBody') loginBody: LoginUserDto,
  ): Promise<RegisterAndSignInResponse> {
    return await this.authService.login(loginBody);
  }
}
