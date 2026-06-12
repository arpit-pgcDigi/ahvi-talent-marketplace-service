import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Public } from '@app/common';

@ApiTags('Health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service status. Used by load balancers and container orchestrators.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-06-09T09:15:53.229Z',
        uptime: 123.45,
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}