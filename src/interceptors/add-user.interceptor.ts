// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class AddUserToContextInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const gqlContext = GqlExecutionContext.create(context).getContext();

//     return next.handle().pipe(
//       tap((data) => {
//         if (data.user) {
//           gqlContext.user = data.user;
//           console.log('from add user interceptor', gqlContext.user);
//         }
//       }),
//     );
//   }
// }
