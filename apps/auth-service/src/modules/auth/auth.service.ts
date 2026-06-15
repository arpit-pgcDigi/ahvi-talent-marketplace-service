import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserPayload } from '@app/common';

const SALT_ROUNDS = 12;

// RpcException import removed — RpcExceptionInterceptor in main.ts
// handles wrapping automatically. Services throw plain HttpExceptions only.
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.authRepository.create({
      email: dto.email,
      password_hash,
      role: dto.role,
      portal: dto.portal,
    });

    this.logger.log(`New user registered: ${user.email} (${user.role})`);

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      portal: user.portal,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    this.authRepository.updateLastLogin(user.id).catch((err) =>
      this.logger.error('Failed to update last_login_at', err),
    );

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      portal: user.portal,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateToken(token: string): Promise<UserPayload> {
    try {
      return this.jwtService.verify<UserPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}