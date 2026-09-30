import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CashIcon } from '../components/ui/Icons';
import { validateCartSchedules } from '../services/scheduleService';
import { formatCurrency, formatDate } from '../utils/formatters';

export function CheckoutScreen() {
  const { state, actions, findUser, condominium } = useApp();
  const { cart } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const seller = cart[0] ? findUser(cart[0].product.sellerId) : undefined;

  if (cart.length === 0) {
    return (
      <Shell nav>
        <PageHeader title="Checkout" onBack={() => actions.navigate('cart')} />
        <ScrollArea>
          <EmptyState
            title="Não há itens para finalizar"
            subtitle="Adicione produtos ao carrinho antes de ir para o checkout."
            actionLabel="Ver catálogo"
            onAction={() => actions.navigate('catalog')}
          />
        </ScrollArea>
      </Shell>
    );
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    const scheduleErrors = validateCartSchedules(cart, condominium);
    if (Object.keys(scheduleErrors).length > 0) next.schedule = Object.values(scheduleErrors)[0];
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const confirm = () => {
    if (!validate()) return;
    setLoading(true);
    window.setTimeout(() => {
      const order = actions.placeOrder('cash');
      if (!order) {
        setLoading(false);
        return;
      }
      actions.navigate('order-confirmation', { orderId: order.id });
    }, 400);
  };

  return (
    <Shell nav>
      <PageHeader title="Checkout" onBack={() => actions.navigate('cart')} />

      <ScrollArea className="px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-1 text-base font-bold text-gray-900">Resumo do pedido</h2>
            <p className="mb-3 text-sm text-gray-500">
              Vendedor: {seller?.sellerProfile?.businessName ?? seller?.name ?? '—'} · Apto{' '}
              {seller?.apartment ?? '—'}
            </p>
            <ul className="flex flex-col gap-2">
              {cart.map((item) => (
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
            {(errors.schedule || state.checkoutError) && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                {errors.schedule || state.checkoutError}
              </p>
            )}
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-3 text-base font-bold text-gray-900">Forma de pagamento</h2>
            <div className="flex min-h-[56px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4">
              <span className="text-gray-500">
                <CashIcon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-gray-900">
                  Pagamento na entrega
                </span>
                <span className="block text-sm text-gray-500">Combine com o vizinho</span>
              </span>
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              Combine o pagamento na hora da entrega. O vendedor confirmará o recebimento no
              aplicativo.
            </p>
          </section>
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-4 md:px-6">
        <div className="mx-auto w-full max-w-[720px]">
          <Button fullWidth size="lg" loading={loading} onClick={confirm}>
            Confirmar pedido - {formatCurrency(total)}
          </Button>
        </div>
      </div>
    </Shell>
  );
}
