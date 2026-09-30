import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../../components/layout/Shell';
import { Badge, STATUS_COLORS } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ReceiptIcon } from '../../components/ui/Icons';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Order } from '../../domain/types';

type Period = 'today' | '7d' | '30d' | 'all';

function filterByPeriod(orders: Order[], period: Period) {
  const now = Date.now();
  if (period === 'today') {
    const today = new Date().toISOString().slice(0, 10);
    return orders.filter((o) => o.date.slice(0, 10) === today);
  }
  const ms = period === '7d' ? 7 * 86400000 : period === '30d' ? 30 * 86400000 : Infinity;
  return orders.filter((o) => now - new Date(o.date).getTime() < ms);
}

function OrderBadge({ status }: { status: Order['status'] }) {
  const c = STATUS_COLORS[status];
  return <Badge bg={c.bg} text={c.text}>{c.label}</Badge>;
}

export function SellerDashboardScreen() {
  const { state, actions, findUser } = useApp();
  const user = state.currentUser!;
  const [period, setPeriod] = useState<Period>('30d');

  const myOrders = useMemo(
    () => state.orders.filter((o) => o.sellerId === user.id),
    [state.orders, user.id]
  );

  const filtered = useMemo(() => filterByPeriod(myOrders, period), [myOrders, period]);
  const delivered = filtered.filter(
    (o) => o.status === 'delivered' && o.paymentStatus === 'approved'
  );
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const avgTicket = delivered.length ? revenue / delivered.length : 0;
  const ratedOrders = delivered.filter((o) => o.buyerRating);
  const avgRating = user.totalRatings
    ? user.rating
    : ratedOrders.length
    ? ratedOrders.reduce((s, o) => s + (o.buyerRating ?? 0), 0) / ratedOrders.length
    : 0;

  const pending = myOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed');

  const byProduct = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {};
    for (const o of delivered) {
      for (const item of o.items) {
        if (!map[item.product.id]) map[item.product.id] = { name: item.product.name, total: 0 };
        map[item.product.id].total += item.product.price * item.qty;
      }
    }
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [delivered]);

  const maxBar = Math.max(...byProduct.map((b) => b.total), 1);

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Hoje' },
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: 'all', label: 'Todos' },
  ];

  return (
    <Shell nav>
      <PageHeader eyebrow={user.sellerProfile?.businessName ?? 'Meu negócio'} title="Dashboard" />
      <ScrollArea className="pb-24 lg:pb-6">
        <div className="space-y-5 px-4 pt-4 md:px-6">
          {/* Period filter */}
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  period === p.key
                    ? 'bg-[#2563EB] text-white'
                    : 'border border-gray-200 bg-white text-gray-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Receita', value: formatCurrency(revenue), color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Pedidos', value: String(filtered.length), color: '#7C3AED', bg: '#F5F3FF' },
              { label: 'Ticket médio', value: formatCurrency(avgTicket), color: '#0D9488', bg: '#F0FDFA' },
              {
                label: 'Avaliação',
                value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—',
                color: '#D97706',
                bg: '#FFFBEB',
              },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl p-4 text-center" style={{ background: k.bg }}>
                <p className="text-xs font-semibold text-gray-500">{k.label}</p>
                <p className="mt-1 text-[18px] font-bold leading-tight" style={{ color: k.color }}>
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          {byProduct.length > 0 && (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-4 text-[14px] font-bold text-gray-900">Receita por produto</p>
              <div className="space-y-3">
                {byProduct.map((b) => (
                  <div key={b.name}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="truncate font-medium text-gray-700" style={{ maxWidth: '65%' }}>
                        {b.name}
                      </span>
                      <span className="font-bold text-[#2563EB]">{formatCurrency(b.total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${(b.total / maxBar) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending orders */}
          {pending.length > 0 && (
            <div>
              <p className="mb-2 text-[14px] font-bold text-gray-900">
                Aguardando ação ({pending.length})
              </p>
              <div className="space-y-2">
                {pending.map((o) => {
                  const buyer = findUser(o.buyerId);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => actions.navigate('seller-orders')}
                      className="w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm active:opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900">
                            {buyer ? `Bloco ${buyer.block}, Apto ${buyer.apartment}` : 'Comprador'}
                          </p>
                          <p className="text-[12px] text-gray-400">
                            {o.items.length} {o.items.length === 1 ? 'item' : 'itens'} · {formatDate(o.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <OrderBadge status={o.status} />
                          <p className="mt-1 text-[13px] font-bold">{formatCurrency(o.total)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent orders */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[14px] font-bold text-gray-900">Últimos pedidos</p>
              <Button variant="ghost" size="sm" onClick={() => actions.navigate('seller-orders')}>
                Ver todos
              </Button>
            </div>
            {myOrders.length === 0 ? (
              <EmptyState
                icon={<ReceiptIcon size={40} className="text-gray-300" />}
                title="Nenhum pedido ainda"
                subtitle="Quando compradores fizerem pedidos, eles aparecem aqui."
              />
            ) : (
              <div className="space-y-2">
                {[...myOrders]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 5)
                  .map((o) => {
                    const buyer = findUser(o.buyerId);
                    return (
                      <div key={o.id} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-semibold text-gray-900">
                              {buyer
                                ? `Bloco ${buyer.block}, Apto ${buyer.apartment}`
                                : 'Comprador'}
                            </p>
                            <p className="text-[12px] text-gray-400">{formatDate(o.date)}</p>
                          </div>
                          <div className="text-right">
                            <OrderBadge status={o.status} />
                            <p className="mt-1 text-[13px] font-bold">{formatCurrency(o.total)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </Shell>
  );
}
