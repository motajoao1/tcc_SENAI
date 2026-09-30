import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../../components/layout/Shell';
import { Badge, STATUS_COLORS } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ReceiptIcon } from '../../components/ui/Icons';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Order, OrderStatus } from '../../domain/types';
import { orderService } from '../../services/orderService';
import { RatingStars } from '../../components/ui/RatingStars';
import { TextAreaField } from '../../components/ui/Field';

type Tab = 'new' | 'active' | 'done';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  preparing: 'Em preparo',
  ready: 'Pronto',
  delivering: 'Em entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

function OrderBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_COLORS[status];
  return <Badge bg={c.bg} text={c.text}>{c.label}</Badge>;
}

export function SellerOrdersScreen() {
  const { state, actions, findUser } = useApp();
  const user = state.currentUser!;
  const [tab, setTab] = useState<Tab>('new');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState('');

  const myOrders = useMemo(
    () =>
      state.orders
        .filter((o) => o.sellerId === user.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.orders, user.id]
  );

  const grouped = useMemo(
    () => ({
      new: myOrders.filter((o) => o.status === 'pending'),
      active: myOrders.filter((o) =>
        ['confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)
      ),
      done: myOrders.filter((o) => o.status === 'delivered' || o.status === 'cancelled'),
    }),
    [myOrders]
  );

  const visible = grouped[tab];

  const TABS: { key: Tab; label: string }[] = [
    { key: 'new', label: `Novos (${grouped.new.length})` },
    { key: 'active', label: `Em andamento (${grouped.active.length})` },
    { key: 'done', label: 'Concluídos' },
  ];

  return (
    <Shell nav>
      <PageHeader title="Pedidos" />

      {/* Tabs */}
      <div className="scrollbar-hidden flex shrink-0 gap-1 overflow-x-auto border-b border-gray-100 bg-white px-4 pb-0 md:px-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 border-b-2 px-3 pb-3 pt-2 text-[13px] font-semibold transition-colors ${
              tab === t.key
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ScrollArea className="pb-24 lg:pb-6">
        <div className="space-y-3 px-4 pt-4 md:px-6">
          {visible.length === 0 ? (
            <EmptyState
              icon={<ReceiptIcon size={40} className="text-gray-300" />}
              title="Nenhum pedido aqui"
              subtitle="Seus pedidos aparecerão nesta lista."
            />
          ) : (
            visible.map((o) => {
              const buyer = findUser(o.buyerId);
              const nextStatuses = orderService.nextStatuses(o.status);
              return (
                <div key={o.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">
                        Pedido #{o.id.slice(-4).toUpperCase()}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        {buyer
                          ? `${buyer.name} · Bloco ${buyer.block}, Apto ${buyer.apartment}`
                          : 'Comprador'}{' '}
                        · {formatDate(o.date)}
                      </p>
                    </div>
                    <OrderBadge status={o.status} />
                  </div>

                  <div className="mb-3 space-y-1 rounded-xl bg-gray-50 px-3 py-2">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[12px]">
                        <span className="text-gray-700">
                          {item.qty}× {item.product.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.product.price * item.qty)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-1 flex justify-between border-t border-gray-200 pt-1 text-[13px]">
                      <span className="font-semibold text-gray-700">Total</span>
                      <span className="font-bold text-gray-900">{formatCurrency(o.total)}</span>
                    </div>
                  </div>

                  {nextStatuses && nextStatuses.length > 0 && (
                    <Button
                      fullWidth
                      size="sm"
                      onClick={() => setSelectedOrder(o)}
                    >
                      Atualizar status
                    </Button>
                  )}
                  {o.status === 'delivered' && o.sellerRating === undefined && (
                    <Button
                      fullWidth
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                      onClick={() => {
                        setRatingOrder(o);
                        setRating(0);
                        setComment('');
                        setRatingError('');
                      }}
                    >
                      Avaliar comprador
                    </Button>
                  )}
                  {o.sellerRating !== undefined && (
                    <div className="mt-3 rounded-xl bg-blue-50 p-3">
                      <p className="mb-1 text-sm font-semibold text-gray-700">Sua avaliação:</p>
                      <RatingStars value={o.sellerRating} showValue={false} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Status update modal */}
      <Modal
        open={selectedOrder !== null}
        title={selectedOrder ? `Pedido #${selectedOrder.id.slice(-4).toUpperCase()}` : ''}
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div>
            <p className="mb-4 text-[14px] text-gray-600">
              Status atual: <strong>{STATUS_LABELS[selectedOrder.status]}</strong>
            </p>
            <p className="mb-3 text-[13px] font-semibold text-gray-700">Atualizar para:</p>
            <div className="space-y-2">
              {orderService.nextStatuses(selectedOrder.status).map((next) => (
                <Button
                  key={next}
                  fullWidth
                  variant={next === 'cancelled' ? 'danger' : 'primary'}
                  onClick={() => {
                    actions.updateOrderStatus(selectedOrder.id, next);
                    setSelectedOrder(null);
                  }}
                >
                  {STATUS_LABELS[next]}
                </Button>
              ))}
            </div>
            <Button
              fullWidth
              variant="ghost"
              className="mt-2"
              onClick={() => setSelectedOrder(null)}
            >
              Fechar
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={ratingOrder !== null}
        title="Avaliar comprador"
        onClose={() => setRatingOrder(null)}
      >
        {ratingOrder && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
              <p className="font-bold text-gray-900">
                {findUser(ratingOrder.buyerId)?.name ?? 'Comprador'}
              </p>
              <p>
                Bloco {findUser(ratingOrder.buyerId)?.block ?? '—'} · Apto{' '}
                {findUser(ratingOrder.buyerId)?.apartment ?? '—'}
              </p>
            </div>
            <RatingStars value={rating} onChange={setRating} size={30} label="Sua nota" />
            {ratingError && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {ratingError}
              </p>
            )}
            <TextAreaField
              id="seller-rating-comment"
              label="Comentário (opcional)"
              placeholder="Conte como foi a experiência com o comprador"
              value={comment}
              onChange={setComment}
            />
            <Button
              fullWidth
              onClick={() => {
                if (rating < 1) {
                  setRatingError('Selecione de 1 a 5 estrelas.');
                  return;
                }
                actions.rateOrder(ratingOrder.id, 'seller', rating, comment.trim());
                setRatingOrder(null);
              }}
            >
              Enviar avaliação
            </Button>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
