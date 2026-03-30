type StatusMeta = {
  label: string;
  tone: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
};

const requestStatusMeta: Record<string, StatusMeta> = {
  open: { label: 'Open', tone: 'success' },
  matching: { label: 'Matching', tone: 'info' },
  in_progress: { label: 'In progress', tone: 'info' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

const orderStatusMeta: Record<string, StatusMeta> = {
  pending_payment: { label: 'Pending payment', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  in_progress: { label: 'In progress', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  disputed: { label: 'Disputed', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'neutral' },
};

const fallbackMeta: StatusMeta = { label: 'Unknown', tone: 'neutral' };

export function getRequestStatusMeta(status: string): StatusMeta {
  return requestStatusMeta[status] ?? fallbackMeta;
}

export function getOrderStatusMeta(status: string): StatusMeta {
  return orderStatusMeta[status] ?? fallbackMeta;
}

export { requestStatusMeta, orderStatusMeta };
