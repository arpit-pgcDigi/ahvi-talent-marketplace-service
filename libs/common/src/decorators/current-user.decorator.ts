import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../dto/user-payload.dto';

// Usage in any gateway controller:
//   @Get('me')
//   getMe(@CurrentUser() user: UserPayload) { ... }
//
// JwtAuthGuard attaches the decoded payload to request.user
// before the controller runs. This decorator just reads it.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);