import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { AUTH_PATTERNS } from '@app/contracts';
import { UserPayload, IS_PUBLIC_KEY } from '@app/common';
import { SERVICE_TOKENS } from '../config/clients.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(SERVICE_TOKENS.AUTH) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked @Public() — skip auth entirely
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

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