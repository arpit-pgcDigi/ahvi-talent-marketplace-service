import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserPayload } from '../dto/user-payload.dto';

// How it works:
// 1. @Roles(Role.HIRING) on a route sets metadata
// 2. This guard reads that metadata via Reflector
// 3. Compares against request.user.role (set by JwtAuthGuard)
// 4. SUPERADMIN always passes — they access everything
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() on this route — let everyone through
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserPayload }>();

    // SUPERADMIN bypasses all role checks
    if (user.role === Role.SUPERADMIN) return true;

    return requiredRoles.includes(user.role);
  }
}