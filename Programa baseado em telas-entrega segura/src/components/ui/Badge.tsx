import type { ReactNode } from 'react';
import type { OrderStatus, PaymentStatus } from '../../domain/types';

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Aguardando' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF', label: 'Confirmado' },
  preparing: { bg: '#FDE68A', text: '#78350F', label: 'Em preparo' },
  ready: { bg: '#D1FAE5', text: '#065F46', label: 'Pronto' },
  delivering: { bg: '#E0E7FF', text: '#3730A3', label: 'Em entrega' },
  delivered: { bg: '#D1FAE5', text: '#065F46', label: 'Entregue' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelado' },
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pagamento pendente',
  approved: 'Pagamento aprovado',
};

export interface BadgeProps {
  children: ReactNode;
  bg?: string;
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  bg = '#EFF6FF',
  text = '#1D4ED8',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
      } ${className}`}
      style={{ background: bg, color: text }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: OrderStatus;
  size?: 'sm' | 'md';
}) {
  const c = STATUS_COLORS[status];
  return (
    <Badge bg={c.bg} text={c.text} size={size}>
      {c.label}
    </Badge>
  );
}
