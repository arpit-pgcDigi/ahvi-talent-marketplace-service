import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

// All service tokens in one place.
// Inject by token: @Inject(SERVICE_TOKENS.AUTH) private authClient: ClientProxy
export const SERVICE_TOKENS = {
  AUTH:         'AUTH_SERVICE',
  TALENT:       'TALENT_SERVICE',
  MARKETPLACE:  'MARKETPLACE_SERVICE',
  ORDERS:       'ORDERS_SERVICE',
  ENGAGEMENT:   'ENGAGEMENT_SERVICE',
  ADMIN:        'ADMIN_SERVICE',
  NOTIFICATION: 'NOTIFICATION_SERVICE',
} as const;

const redisOptions = () => ({
  transport: Transport.REDIS as const,
  options: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    retryAttempts: 5,
    retryDelay: 3000,
  },
});

export const clientsConfig: ClientsModuleOptions = [
  { name: SERVICE_TOKENS.AUTH,         ...redisOptions() },
  { name: SERVICE_TOKENS.TALENT,       ...redisOptions() },
  { name: SERVICE_TOKENS.MARKETPLACE,  ...redisOptions() },
  { name: SERVICE_TOKENS.ORDERS,       ...redisOptions() },
  { name: SERVICE_TOKENS.ENGAGEMENT,   ...redisOptions() },
  { name: SERVICE_TOKENS.ADMIN,        ...redisOptions() },
  { name: SERVICE_TOKENS.NOTIFICATION, ...redisOptions() },
];