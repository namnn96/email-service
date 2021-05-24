import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly _logger: Logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        catchError(err => {
          if (err instanceof HttpException) {
            return throwError(err);
          }
          this._logger.log((err as Error).stack);
          const defaultError = new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
          }, HttpStatus.INTERNAL_SERVER_ERROR);
          return throwError(defaultError);
        }),
        finalize(() => this._logger.log(`${context.switchToHttp().getRequest<Request>().url}... ${Date.now() - now}ms`)),
      );
  }
}
