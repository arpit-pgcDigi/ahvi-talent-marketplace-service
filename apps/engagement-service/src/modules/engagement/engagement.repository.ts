import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class EngagementRepository {
  constructor(private readonly prisma: PrismaService) {}
}