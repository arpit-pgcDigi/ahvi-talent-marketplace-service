import { SetMetadata } from '@nestjs/common';
import { Role, Portal } from '@prisma/client';

// Usage:
//   @Roles(Role.HIRING, Role.SUPERADMIN)
//   @Post('/orders')
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

// Usage:
//   @RequirePortal(Portal.HIRING_PORTAL)
//   @Get('/dashboard')
export const PORTAL_KEY = 'portal';
export const RequirePortal = (...portals: Portal[]) =>
  SetMetadata(PORTAL_KEY, portals);