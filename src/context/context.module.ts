import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt-strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '15m ',
          },
        };
      },
    }),
  ],
  exports: [ContextModule, ContextService],
  providers: [ContextService, UsersService, JwtService, JwtStrategy],
})
export class ContextModule {}
