import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadInterface } from './interfaces/payload.interface';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.authService.validateJwtUser(payload.id);
    // console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
