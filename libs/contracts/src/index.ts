// Patterns — request/reply
export * from './patterns/auth.patterns';
export * from './patterns/talent.patterns';
export * from './patterns/index';

// Events — async fire-and-forget
export * from './events/talent.events';
export * from './events/order.events';

// DTOs — single source of truth for all request/response shapes
export * from './dto/auth/index';
export * from './dto/talent/index';
export * from './dto/shared/index';
export * from './dto/admin/index';