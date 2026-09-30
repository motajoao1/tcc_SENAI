import type { CartItem, Order, OrderStatus, PaymentMethod, PaymentStatus } from '../domain/types';
import { generateId, todayISO } from '../utils/formatters';

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready'],
  ready: ['delivering'],
  delivering: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const ACTIVE_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivering',
];

export const TIMELINE_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivering',
  'delivered',
];

export const orderService = {
  nextStatuses(status: OrderStatus): OrderStatus[] {
    return NEXT_STATUSES[status];
  },

  create(
    items: CartItem[],
    buyerId: string,
    condominiumId: string,
    paymentMethod: PaymentMethod
  ): Order {
    const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const paymentStatus: PaymentStatus = 'pending';
    const now = todayISO();
    return {
      id: `order-${generateId()}`,
      buyerId,
      sellerId: items[0]?.product.sellerId ?? '',
      condominiumId,
      items: items.map((i) => ({ ...i })),
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus,
      date: now,
      updatedAt: now,
    };
  },

  listForBuyer(orders: Order[], buyerId: string): Order[] {
    return orders.filter((o) => o.buyerId === buyerId);
  },

  listForSeller(orders: Order[], sellerId: string): Order[] {
    return orders.filter((o) => o.sellerId === sellerId);
  },

  updateStatus(orders: Order[], orderId: string, status: OrderStatus): Order[] {
    return orders.map((o) =>
      o.id === orderId && NEXT_STATUSES[o.status].includes(status)
        ? {
            ...o,
            status,
            updatedAt: todayISO(),
            paymentStatus:
              status === 'delivered' && o.paymentMethod === 'cash'
                ? ('approved' as PaymentStatus)
                : o.paymentStatus,
          }
        : o
    );
  },

  revenue(orders: Order[]): number {
    return orders
      .filter((o) => o.status === 'delivered' && o.paymentStatus === 'approved')
      .reduce((sum, o) => sum + o.total, 0);
  },
};
