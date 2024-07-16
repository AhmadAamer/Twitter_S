import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
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

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      let defaultMessage = typeof res === 'string' ? res : (res as any).message;

      message = await this.i18n.t(
        `test.HTTP_${(defaultMessage as string).toUpperCase().split(' ').join('_')}`,
        {
          lang: langFromHeader,
        },
      );
    } else {
      message = await this.i18n.t('test.HTTP_INTERNAL_SERVER_ERROR', {
        lang: langFromHeader,
      });
    }

    return new ApolloError(message, `${status}`, {
      timestamp: new Date().toISOString(),
      path: request ? request.url : null,
      code: `${status}`,
    });
  }
}

//?without using i18n..
// import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
// import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
// import { ApolloError } from 'apollo-server-errors';
// import { translation } from 'src/translation';

// @Catch()
// export class AllExceptionsFilter implements GqlExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//   async catch(exception: unknown, host: ArgumentsHost) {
//     const gqlHost = GqlArgumentsHost.create(host);
//     const context = gqlHost.getContext();
//     const response = gqlHost.getContext().res;
//     const request = gqlHost.getContext().req;

//     const langFromHeader = request.headers['lang'];

//     let status = 500;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse();
//       let defaultMessage = typeof res === 'string' ? res : (res as any).message;
//       defaultMessage = (defaultMessage as string)
//         .toUpperCase()
//         .split(' ')
//         .join('_');

//       console.log(defaultMessage);
//       message = translation[langFromHeader][defaultMessage];
//     } else {
//       message = translation[langFromHeader].INTERNAL_SERVER_ERROR;
//     }
//     return new ApolloError(message, `${status}`, {
//       timestamp: new Date().toISOString(),
//       path: request ? request.url : null,
//       code: `${status}`,
//     });
//   }
// }
