import type { Database } from './database.types';

type StatusMeta = {
  label: string;
  tone: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
};

export type RequestStatus =
  Database['public']['Tables']['requests']['Row']['status'];

export type OrderStatus =
  Database['public']['Tables']['orders']['Row']['status'];

const requestStatusMeta = {
  open: { label: 'Open', tone: 'success' },
  matching: { label: 'Matching', tone: 'info' },
  in_progress: { label: 'In progress', tone: 'info' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
} satisfies Record<RequestStatus, StatusMeta>;

const orderStatusMeta = {
  pending_payment: { label: 'Pending payment', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  in_progress: { label: 'In progress', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  disputed: { label: 'Disputed', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'neutral' },
} satisfies Record<OrderStatus, StatusMeta>;

const fallbackMeta: StatusMeta = { label: 'Unknown', tone: 'neutral' };

function getStatusMeta<TStatus extends string>(
  status: TStatus,
  statusMeta: Record<TStatus, StatusMeta>,
): StatusMeta {
  return statusMeta[status] ?? fallbackMeta;
}

export function getRequestStatusMeta(status: RequestStatus): StatusMeta {
  return getStatusMeta(status, requestStatusMeta);
}

export function getOrderStatusMeta(status: OrderStatus): StatusMeta {
  return getStatusMeta(status, orderStatusMeta);
}

export { requestStatusMeta, orderStatusMeta };
