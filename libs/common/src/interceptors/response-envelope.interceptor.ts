import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface EnvelopedResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string | undefined;
}

// Applied globally in api-gateway main.ts
// Every successful response becomes:
// { success: true, data: <original response>, timestamp, requestId }
// Frontend can always rely on this shape — no more guessing
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<EnvelopedResponse<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.headers['x-request-id'] as string | undefined;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }
}