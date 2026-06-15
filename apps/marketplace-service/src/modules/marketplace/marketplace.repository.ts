import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class MarketplaceRepository {
  constructor(private readonly prisma: PrismaService) {}
}