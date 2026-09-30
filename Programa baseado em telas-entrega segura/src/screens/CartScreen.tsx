import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CartIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/ui/Icons';
import { formatCurrency, todayISO } from '../utils/formatters';
import { validateCartSchedules } from '../services/scheduleService';

export function CartScreen() {
  const { state, actions, findUser, condominium } = useApp();
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);
  const { cart } = state;
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const scheduleErrors = validateCartSchedules(cart, condominium);

  return (
    <Shell nav>
      <PageHeader
        title="Seu carrinho"
        subtitle={`${cart.reduce((s, i) => s + i.qty, 0)} ${
          cart.reduce((s, i) => s + i.qty, 0) === 1 ? 'item' : 'itens'
        }`}
        onBack={() => actions.navigate('catalog')}
      />

      <ScrollArea className="px-4 py-4 md:px-6">
        {cart.length === 0 ? (
          <EmptyState
            icon={<CartIcon size={30} />}
            title="Seu carrinho está vazio"
            subtitle="Explore os anúncios dos seus vizinhos e adicione itens ao carrinho."
            actionLabel="Ver catálogo"
            onAction={() => actions.navigate('catalog')}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
            {cart.map((item) => {
              const seller = findUser(item.product.sellerId);
              const isService = item.product.type === 'service';
              return (
                <div
                  key={item.product.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="text-sm font-bold leading-snug text-gray-900">
                        {item.product.name}
                      </p>
                      <Badge>Apto {seller?.apartment ?? '—'}</Badge>
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrency(item.product.price * item.qty)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remover ${item.product.name} do carrinho`}
                      onClick={() => actions.removeFromCart(item.product.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full bg-red-50 text-red-600 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-3 py-2">
                    <span className="text-sm text-gray-500">
                      {formatCurrency(item.product.price)} cada
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${item.product.name}`}
                        onClick={() => actions.updateCartQty(item.product.id, item.qty - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className="w-6 text-center text-base font-bold text-gray-900">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${item.product.name}`}
                        disabled={item.qty >= item.product.stock}
                        onClick={() => actions.updateCartQty(item.product.id, item.qty + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {isService && (
                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-blue-50 p-3">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor={`cart-date-${item.product.id}`}
                          className="text-sm font-semibold text-gray-700"
                        >
                          Data do serviço
                        </label>
                        <input
                          id={`cart-date-${item.product.id}`}
                          type="date"
                          min={todayISO()}
                          value={item.schedDate}
                          onChange={(e) =>
                            actions.updateCartSchedule(
                              item.product.id,
                              e.target.value,
                              item.schedTime
                            )
                          }
                          className="min-h-[48px] rounded-xl border border-blue-100 bg-white px-3 text-[15px] text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor={`cart-time-${item.product.id}`}
                          className="text-sm font-semibold text-gray-700"
                        >
                          Horário
                        </label>
                        <input
                          id={`cart-time-${item.product.id}`}
                          type="time"
                          value={item.schedTime}
                          onChange={(e) =>
                            actions.updateCartSchedule(
                              item.product.id,
                              item.schedDate,
                              e.target.value
                            )
                          }
                          className="min-h-[48px] rounded-xl border border-blue-100 bg-white px-3 text-[15px] text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                      </div>
                      {checkoutAttempted && scheduleErrors[item.product.id] && (
                        <p
                          role="alert"
                          className="col-span-2 text-sm font-medium text-red-600"
                        >
                          {scheduleErrors[item.product.id]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div
        className="shrink-0 border-t border-gray-100 bg-white px-4 pt-4 md:px-6"
        style={{ paddingBottom: '1rem' }}
      >
        <div className="mx-auto w-full max-w-[720px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
          <Button
            fullWidth
            size="lg"
            disabled={cart.length === 0}
            onClick={() => {
              setCheckoutAttempted(true);
              if (Object.keys(scheduleErrors).length === 0) actions.navigate('checkout');
            }}
          >
            Ir para checkout
          </Button>
        </div>
      </div>
    </Shell>
  );
}
