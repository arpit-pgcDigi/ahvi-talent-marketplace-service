import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}
}