import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

// Why this exists:
// When a microservice throws RpcException, it travels back
// to the api-gateway as a raw error object. Without this filter,
// the gateway returns a 500 with an unhelpful message.
// This filter converts it to the correct HTTP status + message.
@Catch()
export class AllExceptionsFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof RpcException) {
      const err = exception.getError();
      if (
        typeof err === 'object' &&
        err !== null &&
        'statusCode' in err
      ) {
        const e = err as { statusCode: number; message: string };
        status = e.statusCode;
        message = e.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`HTTP ${status}: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}