import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { AUTH_PATTERNS } from '@app/contracts';
import { UserPayload } from '@app/common';
import { SERVICE_TOKENS } from '../config/clients.config';

// Flow:
// 1. Extract Bearer token from Authorization header
// 2. Send to auth-service via Redis to validate
// 3. auth-service verifies JWT signature and expiry
// 4. On success: attach UserPayload to request.user
// 5. On failure: throw UnauthorizedException
//
// Gateway never holds JWT_SECRET — only auth-service does.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(SERVICE_TOKENS.AUTH) private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user: UserPayload;
    }>();

    const token = this.extractToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = await firstValueFrom<UserPayload>(
        this.authClient
          .send<UserPayload>(AUTH_PATTERNS.VALIDATE_TOKEN, { token })
          .pipe(
            // Without timeout, a Redis outage hangs every request forever
            timeout(5000),
            catchError((err) => {
              this.logger.error('Token validation failed', err);
              return throwError(
                () => new UnauthorizedException('Token validation failed'),
              );
            }),
          ),
      );

      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractToken(authorization?: string): string | null {
    if (!authorization) return null;
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}