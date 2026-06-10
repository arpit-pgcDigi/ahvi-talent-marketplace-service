import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { User, Role, Portal } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: {
    email: string;
    password_hash: string;
    role: Role;
    portal: Portal;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { last_login_at: new Date() },
    });
  }
}