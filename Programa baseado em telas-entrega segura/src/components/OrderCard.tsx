import type { Order } from '../domain/types';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from './ui/Badge';
import { ChevronRightIcon } from './ui/Icons';

export interface OrderCardProps {
  order: Order;
  /** 'buyer' shows the seller, 'seller' shows the buyer. */
  perspective?: 'buyer' | 'seller';
  onOpen?: (order: Order) => void;
  actionSlot?: React.ReactNode;
}

export function OrderCard({
  order,
  perspective = 'buyer',
  onOpen,
  actionSlot,
}: OrderCardProps) {
  const { findUser } = useApp();
  const counterpart = findUser(perspective === 'buyer' ? order.sellerId : order.buyerId);
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
  const counterpartLabel =
    perspective === 'buyer'
      ? counterpart?.sellerProfile?.businessName ?? counterpart?.name ?? 'Vendedor'
      : `${counterpart?.name ?? 'Morador'} · Apto ${counterpart?.apartment ?? '—'}`;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">
            Pedido #{order.id.slice(-4).toUpperCase()}
          </p>
          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-3 truncate text-sm text-gray-700">
        {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
        {order.items.map((i) => i.product.name).join(', ')}
      </p>
      <p className="mt-0.5 truncate text-sm text-gray-500">{counterpartLabel}</p>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <p className="text-base font-bold text-gray-900">{formatCurrency(order.total)}</p>
        {actionSlot ??
          (onOpen && (
            <button
              type="button"
              onClick={() => onOpen(order)}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Ver detalhes
              <ChevronRightIcon size={16} />
            </button>
          ))}
      </div>
    </div>
  );
}
