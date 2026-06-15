import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}
}