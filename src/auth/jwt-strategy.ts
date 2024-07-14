import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadInterface } from './interfaces/payload.interface';
import { AuthService } from './auth.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'justForNowhahaha',
    });
  }
  async validate(payload: PayloadInterface) {
    const user = await this.authService.validateJwtUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
