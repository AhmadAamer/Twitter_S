import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const response = gqlHost.getContext().res;
    const request = gqlHost.getContext().req;

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
    }

    this.logger.warn(`Status: ${status}, Error: ${JSON.stringify(exception)}`);

    // Return a GraphQL-friendly error without exposing the stack trace
    return new ApolloError(message, `${status}`, {
      timestamp: new Date().toISOString(),
      path: request ? request.url : null,
      code: `${status}`,
    });
  }
}
