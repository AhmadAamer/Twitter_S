import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneralResInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success..✅',
          message: 'Data retrieved successfully',
          data,
        };
      }),
    );
  }
}

export interface Response<T> {
  status: string;
  message: string;
  data: T;
}
