import { useApp } from '../context/AppContext';
import { ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CheckIcon } from '../components/ui/Icons';
import { PAYMENT_STATUS_LABELS } from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';

const METHOD_LABELS = {
  cash: 'Pagamento na entrega',
} as const;

export function OrderConfirmationScreen() {
  const { state, actions, findUser } = useApp();
  const orderId = state.screenParams.orderId as string | undefined;
  const order = state.orders.find((o) => o.id === orderId) ?? state.lastOrder;

  if (!order) {
    return (
      <Shell bg="white">
        <ScrollArea>
          <EmptyState
            title="Nenhum pedido recente"
            subtitle="Quando você finalizar uma compra, o resumo aparecerá aqui."
            actionLabel="Ver catálogo"
            onAction={() => actions.navigate('catalog')}
          />
        </ScrollArea>
      </Shell>
    );
  }

  const seller = findUser(order.sellerId);

  return (
    <Shell bg="white">
      <ScrollArea className="px-6 py-10">
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-5 text-center">
          <img src="/assets/f7824.png" alt="Entrega Fácil" className="h-auto w-[160px]" />

          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <CheckIcon size={40} />
          </span>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido realizado!</h1>
            <p className="mt-1 text-[15px] text-gray-600">
              Pedido #{order.id.slice(-4).toUpperCase()} enviado para{' '}
              {seller?.sellerProfile?.businessName ?? seller?.name ?? 'seu vizinho'}.
            </p>
          </div>

          <div className="w-full rounded-2xl bg-gray-50 p-4 text-left">
            <ul className="flex flex-col gap-2">
              {order.items.map((item) => (
                <li key={item.product.id} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 text-gray-700">
                    {item.qty}x {item.product.name}
                    {item.product.type === 'service' && item.schedDate && (
                      <span className="block text-sm text-[#1D4ED8]">
                        Agendado para {formatDate(item.schedDate)}
                        {item.schedTime ? ` às ${item.schedTime}` : ''}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {formatCurrency(item.product.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {METHOD_LABELS[order.paymentMethod]} ·{' '}
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button fullWidth size="lg" onClick={() => actions.navigate('orders')}>
              Ver meus pedidos
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="secondary"
              onClick={() => actions.navigate('catalog')}
            >
              Continuar comprando
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Shell>
  );
}
