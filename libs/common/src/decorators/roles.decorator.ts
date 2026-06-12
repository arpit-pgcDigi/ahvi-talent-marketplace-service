import { SetMetadata } from '@nestjs/common';
import { Role, Portal } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

export const PORTAL_KEY = 'portal';
export const RequirePortal = (...portals: Portal[]) =>
  SetMetadata(PORTAL_KEY, portals);

// ── Public decorator ────────────────────────────────────────────────────
// Routes marked @Public() skip the global JwtAuthGuard entirely.
// Use on: /auth/register, /auth/login, /health
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);