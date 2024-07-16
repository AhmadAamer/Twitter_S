// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   Logger,
// } from '@nestjs/common';
// import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
// import { ApolloError } from 'apollo-server-errors';
// import { I18nService } from 'nestjs-i18n';

// @Catch()
// export class AllExceptionsFilter implements GqlExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//   constructor(private readonly i18n: I18nService) {}
//   catch(exception: unknown, host: ArgumentsHost) {
//     const gqlHost = GqlArgumentsHost.create(host);
//     const context = gqlHost.getContext();
//     const response = gqlHost.getContext().res;
//     const request = gqlHost.getContext().req;

//     let status = 500;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse();
//       message = typeof res === 'string' ? res : (res as any).message;
//     }

//     this.logger.warn(`Status: ${status}, Error: ${JSON.stringify(exception)}`);

//     // Return a GraphQL-friendly error without exposing the stack trace
//     return new ApolloError(message, `${status}`, {
//       timestamp: new Date().toISOString(),
//       path: request ? request.url : null,
//       code: `${status}`,
//     });
//   }
// }
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly i18n: I18nService<Record<string, unknown>>) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const response = gqlHost.getContext().res;
    const request = gqlHost.getContext().req;

    let status = 500;
    let message = 'Internal server error';
    const langFromHeader = request.headers['lang'];
    // console.log(langFromHeader);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      let defaultMessage = typeof res === 'string' ? res : (res as any).message;
      // console.log(
      //   'message before translation: ',
      //   (defaultMessage as string).toUpperCase(),
      // );

      message = await this.i18n.t(
        `test.HTTP_${(defaultMessage as string).toUpperCase()}`,
        {
          lang: langFromHeader,
        },
      );
      // console.log('after : ', message);
    } else {
      message = await this.i18n.t('test.HTTP_INTERNAL_SERVER_ERROR', {
        lang: langFromHeader,
      });
    }

    // this.logger.warn(`Status: ${status}, Error: ${JSON.stringify(exception)}`);

    return new ApolloError(message, `${status}`, {
      timestamp: new Date().toISOString(),
      path: request ? request.url : null,
      code: `${status}`,
    });
  }
}
