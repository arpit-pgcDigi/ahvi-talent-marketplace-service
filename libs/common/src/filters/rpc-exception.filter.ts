import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof RpcException) {
      const err = exception.getError();

      if (err instanceof HttpException) {
        // RpcException wrapping an HttpException — extract correctly
        status = err.getStatus();
        const errResponse = err.getResponse();
        message =
          typeof errResponse === 'object' && errResponse !== null && 'message' in errResponse
            ? (errResponse as { message: string | string[] }).message
            : err.message;
      } else if (typeof err === 'object' && err !== null) {
        const e = err as { statusCode?: number; status?: number; message?: string };
        status = e.statusCode ?? e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        message = e.message ?? 'Internal server error';
      } else if (typeof err === 'string') {
        message = err;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errResponse = exception.getResponse();
      message =
        typeof errResponse === 'object' && errResponse !== null && 'message' in errResponse
          ? (errResponse as { message: string | string[] }).message
          : exception.message;
    } else if (exception instanceof Error) {
      // Never expose raw error messages to clients — log server side only
      this.logger.error(`Unhandled error: ${exception.stack}`);
      message = 'Internal server error';
    }

    this.logger.error(`HTTP ${status}: ${JSON.stringify(message)}`);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}