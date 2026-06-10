export const ORDER_EVENTS = {
  CREATED:           'order.created',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED:    'payment.failed',
  CANCELLED:         'order.cancelled',
} as const;

export interface PaymentSucceededEvent {
  order_id: string;
  client_user_id: string;
  client_company_name: string;
  items: Array<{
    order_item_id: string;
    talent_id: string;
    hours_per_week: number;
    duration_weeks: number;
    agreed_rate: number;
  }>;
}

export interface PaymentFailedEvent {
  order_id: string;
  reason: string;
}