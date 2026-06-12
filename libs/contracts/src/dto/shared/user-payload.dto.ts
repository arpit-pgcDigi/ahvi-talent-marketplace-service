import { Role, Portal } from '@prisma/client';

export interface UserPayload {
  sub: string;
  email: string;
  role: Role;
  portal: Portal;
  iat?: number;
  exp?: number;
}