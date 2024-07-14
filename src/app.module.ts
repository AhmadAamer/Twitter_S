import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
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
          entities: [User, Tweet, Attachment, Like, Comment],
          database: 'twitter_s',
          synchronize: true,
          logging: false,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
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

        // Remove stack trace in production
        if (process.env.NODE_ENV === 'production') {
          delete (graphQLFormattedError.extensions as any).exception;
        }

        return graphQLFormattedError;
      },
    }),
    UsersModule,
    TweetsModule,
    AuthModule,
    LikesModule,
    CommentsModule,
    AttachmentsModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes();
  }
}
