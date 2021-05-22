import {
  CallHandler,
  ExecutionContext, HttpException, HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        catchError(err => {
          if (err instanceof HttpException) {
            return throwError(err);
          }
          console.log((err as Error).stack);
          const defaultError = new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
          }, HttpStatus.INTERNAL_SERVER_ERROR);
          return throwError(defaultError);
        }),
        finalize(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
