import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterAndSignInResponse } from './dtos/registerAndSignIn-res.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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
    const user = await this.authService.validateUser(
      loginBody.email,
      loginBody.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
