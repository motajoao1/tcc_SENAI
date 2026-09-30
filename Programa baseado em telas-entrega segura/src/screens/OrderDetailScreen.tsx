import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { StatusTimeline } from '../components/StatusTimeline';
import { PAYMENT_STATUS_LABELS, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { RatingStars } from '../components/ui/RatingStars';
import { TextAreaField } from '../components/ui/Field';
import { formatCurrency, formatDate, getInitials } from '../utils/formatters';

const METHOD_LABELS = {
  cash: 'Pagamento na entrega',
} as const;

export function OrderDetailScreen() {
  const { state, actions, findUser } = useApp();
  const orderId = state.screenParams.orderId as string | undefined;
  const order = state.orders.find((o) => o.id === orderId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState('');

  if (!order) {
    return (
      <Shell nav>
        <PageHeader title="Pedido" onBack={() => actions.navigate('orders')} />
        <ScrollArea>
          <EmptyState
            title="Pedido não encontrado"
            subtitle="Volte para a lista e escolha um pedido válido."
            actionLabel="Meus pedidos"
            onAction={() => actions.navigate('orders')}
          />
        </ScrollArea>
      </Shell>
    );
  }

  const seller = findUser(order.sellerId);
  const canConfirm = order.status === 'delivered' && !order.receiptConfirmedAt;
  const showRatingForm =
    order.status === 'delivered' &&
    Boolean(order.receiptConfirmedAt) &&
    order.buyerRating === undefined;

  const submitRating = () => {
    if (rating < 1) {
      setRatingError('Selecione de 1 a 5 estrelas.');
      return;
    }
    setRatingError('');
    actions.rateOrder(order.id, 'buyer', rating, comment.trim());
  };

  return (
    <Shell nav>
      <PageHeader
        title={`Pedido #${order.id.slice(-4).toUpperCase()}`}
        subtitle={`Feito em ${formatDate(order.date)}`}
        onBack={() => actions.navigate('orders')}
        right={<StatusBadge status={order.status} size="md" />}
      />

      <ScrollArea className="px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-base font-bold text-gray-900">Acompanhamento</h2>
            <StatusTimeline order={order} />
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-3 text-base font-bold text-gray-900">Itens</h2>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.img}
                    alt={item.product.name}
                    className="h-14 w-14 shrink-0 rounded-xl bg-gray-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">Quantidade: {item.qty}</p>
                    {item.product.type === 'service' && item.schedDate && (
                      <p className="text-sm text-[#1D4ED8]">
                        {formatDate(item.schedDate)}
                        {item.schedTime ? ` às ${item.schedTime}` : ''}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-900">
                    {formatCurrency(item.product.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-3 text-base font-bold text-gray-900">Vendedor</h2>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                {getInitials(seller?.name ?? 'EF')}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {seller?.sellerProfile?.businessName ?? seller?.name ?? 'Vendedor'}
                </p>
                <p className="truncate text-sm text-gray-500">
                  Bloco {seller?.block ?? '—'} · Apto {seller?.apartment ?? '—'}
                  {seller?.sellerProfile?.phone ? ` · ${seller.sellerProfile.phone}` : ''}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-2 text-base font-bold text-gray-900">Pagamento</h2>
            <p className="text-sm text-gray-700">{METHOD_LABELS[order.paymentMethod]}</p>
            <p className="text-sm text-gray-500">
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </p>
          </section>

          {order.buyerRating !== undefined && (
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-2 text-base font-bold text-gray-900">Sua avaliação</h2>
              <RatingStars value={order.buyerRating} showValue={false} />
              {order.buyerComment && (
                <p className="mt-2 text-sm text-gray-600">“{order.buyerComment}”</p>
              )}
            </section>
          )}

          {order.receiptConfirmedAt && (
            <section className="rounded-2xl bg-green-50 p-4 text-green-900">
              <p className="text-sm font-bold">Recebimento confirmado</p>
              <p className="mt-1 text-sm">
                Recebimento confirmado em {formatDate(order.receiptConfirmedAt)}
              </p>
            </section>
          )}

          {showRatingForm && (
            <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-base font-bold text-gray-900">Avalie o vendedor</h2>
              <RatingStars value={rating} onChange={setRating} size={30} label="Sua nota" />
              {ratingError && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {ratingError}
                </p>
              )}
              <TextAreaField
                id="rating-comment"
                label="Comentário (opcional)"
                placeholder="Conte como foi a compra com seu vizinho"
                value={comment}
                onChange={setComment}
              />
              <Button fullWidth onClick={submitRating}>
                Enviar avaliação
              </Button>
            </section>
          )}

          {canConfirm && (
            <Button fullWidth size="lg" onClick={() => setConfirmOpen(true)}>
              Confirmar recebimento
            </Button>
          )}
        </div>
      </ScrollArea>

      <Modal
        open={confirmOpen}
        title="Confirmar recebimento"
        onClose={() => setConfirmOpen(false)}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>
              Ainda não recebi
            </Button>
            <Button
              fullWidth
              onClick={() => {
                actions.confirmReceipt(order.id);
                setConfirmOpen(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        }
      >
        <p>Você confirma que recebeu este pedido?</p>
      </Modal>
    </Shell>
  );
}
