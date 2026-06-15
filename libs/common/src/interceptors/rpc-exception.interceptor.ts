import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Applied globally in every microservice's main.ts
// Services throw plain HttpException subclasses:
//   throw new ConflictException('Email already registered')
//   throw new NotFoundException('Profile not found')
// This interceptor catches them and wraps in RpcException
// so the error travels correctly back to the gateway
@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RpcExceptionInterceptor.name);

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        // Already an RpcException — pass through unchanged
        if (err instanceof RpcException) {
          return throwError(() => err);
        }

        // HttpException — wrap it so status code is preserved
        if (err instanceof HttpException) {
          return throwError(
            () =>
              new RpcException({
                statusCode: err.getStatus(),
                message: err.message,
              }),
          );
        }

        // Unknown error — log it and return safe 500
        this.logger.error(`Unhandled error in microservice: ${err?.message}`, err?.stack);
        return throwError(
          () =>
            new RpcException({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Internal server error',
            }),
        );
      }),
    );
  }
}