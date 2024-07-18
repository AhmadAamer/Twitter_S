import {
  ExecutionContext,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Context, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './users/user.entity';
import { Tweet } from './tweets/tweet.entity';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachment } from './attachments/attachments.entity';
import { Like } from './likes/like.entity';
import { Comment } from './comments/comment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/dataloader.service';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entities/follow.entity';

import { RoleModule } from './role/role.module';
import { Role } from './role/role.entity';
import { ContextModule } from './context/context.module';
import { ContextService } from './context/context.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: config.get<number>('DB_PORT'),
          password: config.get<string>('DB_PASSWORD'),
          username: config.get<string>('DB_USERNAME'),
          entities: [User, Tweet, Attachment, Like, Comment, Follow, Role],
          database: 'twitter_s',
          synchronize: true,
          logging: false,
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule, ContextModule],
      useFactory: (
        dataloaderService: DataloaderService,
        contextService: ContextService,
      ) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          context: ({ req, res }) => ({
            req,
            res,
            loaders: dataloaderService.getLoaders(),
            user: contextService.getUser(req),
          }),
          formatError: (error: GraphQLError): GraphQLFormattedError => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message: error.message,
              locations: error.locations,
              path: error.path,
              extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                timestamp: new Date().toISOString(),
                path: error.path?.[0] || null,
              },
            };
            return graphQLFormattedError;
          },
        };
      },
      inject: [DataloaderService, ContextService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join('./dist/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    UsersModule,
    TweetsModule,
    AuthModule,
    LikesModule,
    CommentsModule,
    AttachmentsModule,
    DataloaderModule,
    FollowModule,
    RoleModule,
    ContextModule,
  ],
  providers: [AppService, ContextService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
