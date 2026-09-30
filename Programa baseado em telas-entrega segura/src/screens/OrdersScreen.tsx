import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { OrderCard } from '../components/OrderCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ReceiptIcon } from '../components/ui/Icons';
import { ACTIVE_STATUSES, orderService } from '../services/orderService';
import type { Order } from '../domain/types';

type Tab = 'active' | 'done' | 'cancelled';

const TABS: { id: Tab; label: string }[] = [
  { id: 'active', label: 'Em andamento' },
  { id: 'done', label: 'Concluídos' },
  { id: 'cancelled', label: 'Cancelados' },
];

export function OrdersScreen() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState<Tab>('active');

  const myOrders = state.currentUser
    ? orderService.listForBuyer(state.orders, state.currentUser.id)
    : [];

  const byTab: Record<Tab, Order[]> = {
    active: myOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
    done: myOrders.filter((o) => o.status === 'delivered'),
    cancelled: myOrders.filter((o) => o.status === 'cancelled'),
  };

  const list = [...byTab[tab]].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell nav>
      <PageHeader title="Meus pedidos" subtitle={`${myOrders.length} no total`} />

      <div className="shrink-0 border-b border-gray-100 bg-white px-4 pb-3 md:px-6">
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1" role="tablist">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`min-h-[44px] flex-1 rounded-lg px-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                {t.label}
                <span className="ml-1 text-gray-400">({byTab[t.id].length})</span>
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="px-4 py-4 md:px-6">
        {list.length === 0 ? (
          <EmptyState
            icon={<ReceiptIcon size={28} />}
            title="Nenhum pedido nesta aba"
            subtitle={
              tab === 'active'
                ? 'Quando você fizer um pedido, poderá acompanhar o status por aqui.'
                : 'Ainda não há pedidos com esse status.'
            }
            actionLabel={tab === 'active' ? 'Ver catálogo' : undefined}
            onAction={tab === 'active' ? () => actions.navigate('catalog') : undefined}
          />
        ) : (
          <div className="mx-auto grid w-full max-w-[900px] gap-3 md:grid-cols-2">
            {list.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                perspective="buyer"
                onOpen={(order) => actions.navigate('order-detail', { orderId: order.id })}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </Shell>
  );
}
