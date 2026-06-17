export const MARKETPLACE_PATTERNS = {
  // Browse
  LIST_TALENTS: 'marketplace.list_talents',
  GET_TALENT: 'marketplace.get_talent',
  // Cart
  GET_CART: 'marketplace.get_cart',
  ADD_TO_CART: 'marketplace.add_to_cart',
  REMOVE_FROM_CART: 'marketplace.remove_from_cart',
  CLEAR_CART: 'marketplace.clear_cart',
  // Wishlist
  GET_WISHLIST: 'marketplace.get_wishlist',
  ADD_TO_WISHLIST: 'marketplace.add_to_wishlist',
  REMOVE_FROM_WISHLIST: 'marketplace.remove_from_wishlist',
  // Views
  RECORD_VIEW: 'marketplace.record_profile_view',
} as const;

export const ORDERS_PATTERNS = {
  CHECKOUT: 'orders.checkout',
  GET_ORDER: 'orders.get_order',
  LIST_ORDERS: 'orders.list_orders',
  APPLY_COUPON: 'orders.apply_coupon',
  PAYMENT_WEBHOOK: 'orders.payment_webhook',
} as const;

export const ENGAGEMENT_PATTERNS = {
  CREATE: 'engagement.create',
  GET: 'engagement.get',
  LIST_BY_TALENT: 'engagement.list_by_talent',
  LIST_BY_CLIENT: 'engagement.list_by_client',
  SUBMIT_TIMESHEET: 'engagement.submit_timesheet',
  APPROVE_TIMESHEET: 'engagement.approve_timesheet',
} as const;

export const ADMIN_PATTERNS = {
  APPROVE_TALENT: 'admin.approve_talent',
  REJECT_TALENT: 'admin.reject_talent',
  LIST_PENDING: 'admin.list_pending_profiles',
  GET_TALENT: 'admin.get_talent',
  UPDATE_SETTING: 'admin.update_platform_setting',
  GET_SETTINGS: 'admin.get_platform_settings',
  GET_AUDIT_LOGS: 'admin.get_audit_logs',
  GET_DASHBOARD: 'admin.get_dashboard',
  LIST_USERS: 'admin.list_users',
  BAN_USER: 'admin.ban_user',
} as const;