import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CalendarIcon, ClockIcon, MinusIcon, PlusIcon } from '../components/ui/Icons';
import { RatingStars } from '../components/ui/RatingStars';
import {
  formatCurrency,
  formatHour,
  formatWeekdays,
  getInitials,
  todayISO,
} from '../utils/formatters';
import { validateSchedule } from '../services/scheduleService';

export function ProductDetailScreen() {
  const { state, actions, condominium, findUser } = useApp();
  const productId = state.screenParams.productId as string | undefined;
  const product = state.products.find((p) => p.id === productId);
  const cartItem = state.cart.find((i) => i.product.id === productId);

  const [schedDate, setSchedDate] = useState(cartItem?.schedDate ?? '');
  const [schedTime, setSchedTime] = useState(cartItem?.schedTime ?? '');
  const [scheduleError, setScheduleError] = useState('');

  if (!product) {
    return (
      <Shell nav>
        <PageHeader title="Produto" onBack={() => actions.navigate('catalog')} />
        <ScrollArea>
          <EmptyState
            title="Produto não encontrado"
            subtitle="Este anúncio pode ter sido removido pelo vendedor."
            actionLabel="Voltar ao catálogo"
            onAction={() => actions.navigate('catalog')}
          />
        </ScrollArea>
      </Shell>
    );
  }

  const seller = findUser(product.sellerId);
  const soldOut = product.stock <= 0;
  const isService = product.type === 'service';

  const handleAdd = () => {
    const validation = validateSchedule({
      condominium,
      product,
      date: schedDate,
      time: schedTime,
    });
    if (!validation.valid) {
      setScheduleError(validation.message ?? 'Este horário não está disponível.');
      return;
    }
    setScheduleError('');
    if (cartItem) {
      if (isService) {
        actions.updateCartSchedule(product.id, schedDate, schedTime);
      }
      actions.navigate('cart');
      return;
    }
    const result = actions.addToCart(
      product,
      1,
      isService ? { schedDate, schedTime } : undefined
    );
    if (result === 'added') actions.navigate('cart');
  };

  return (
    <Shell nav>
      <PageHeader title="Detalhes" onBack={() => actions.navigate('catalog')} />

      <ScrollArea className="pb-6">
        <img
          src={product.img}
          alt={product.name}
          className="h-[250px] w-full bg-gray-100 object-cover"
        />

        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-4 pt-4 md:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge>{product.category}</Badge>
              <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900">
                {product.name}
              </h2>
            </div>
            {isService && product.duration && (
              <Badge bg="#F1F5F9" text="#334155">
                Duração {product.duration}
              </Badge>
            )}
          </div>

          <RatingStars value={product.rating} count={product.totalRatings} size={18} />

          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
              {getInitials(seller?.name ?? 'EF')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                {seller?.sellerProfile?.businessName ?? seller?.name ?? 'Vendedor'}
              </p>
              <p className="truncate text-sm text-gray-500">
                Bloco {seller?.block ?? '—'} · Apto {seller?.apartment ?? '—'}
              </p>
            </div>
            {seller && seller.totalRatings > 0 && (
              <div className="ml-auto shrink-0">
                <RatingStars value={seller.rating} count={seller.totalRatings} size={13} />
              </div>
            )}
          </div>

          <p className="text-[15px] leading-relaxed text-gray-700">{product.description}</p>

          <div className="flex items-end justify-between gap-3">
            <p className="text-2xl font-bold text-[#2563EB]">
              {formatCurrency(product.price)}
            </p>
            <p className={`text-sm font-semibold ${soldOut ? 'text-red-600' : 'text-gray-600'}`}>
              {soldOut
                ? 'Esgotado'
                : `Disponível: ${product.stock} ${isService ? 'vagas' : 'unidades'}`}
            </p>
          </div>

          {isService && (
            <div className="flex flex-col gap-3 rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-bold text-gray-900">Agendar serviço</p>
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  {formatWeekdays(product.availableDays ?? condominium?.allowedDays ?? [])}
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon size={16} />
                  {product.availableStart ?? formatHour(condominium?.allowedHours.start ?? 8)} às{' '}
                  {product.availableEnd ?? formatHour(condominium?.allowedHours.end ?? 22)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sched-date" className="text-sm font-semibold text-gray-700">
                    Data
                  </label>
                  <input
                    id="sched-date"
                    type="date"
                    min={todayISO()}
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="min-h-[48px] w-full rounded-xl border border-blue-100 bg-white px-3 text-[15px] text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sched-time" className="text-sm font-semibold text-gray-700">
                    Horário
                  </label>
                  <input
                    id="sched-time"
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="min-h-[48px] w-full rounded-xl border border-blue-100 bg-white px-3 text-[15px] text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {scheduleError && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {scheduleError}
                </p>
              )}
            </div>
          )}

          {cartItem ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-700">No carrinho</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => actions.updateCartQty(product.id, cartItem.qty - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <MinusIcon size={16} />
                </button>
                <span className="w-6 text-center text-base font-bold text-gray-900">
                  {cartItem.qty}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  disabled={cartItem.qty >= product.stock}
                  onClick={() => actions.updateCartQty(product.id, cartItem.qty + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                >
                  <PlusIcon size={16} />
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-1">
            <Button fullWidth size="lg" disabled={soldOut} onClick={handleAdd}>
              {cartItem
                ? isService
                  ? 'Atualizar e ir ao carrinho'
                  : 'Ver carrinho'
                : 'Adicionar ao carrinho'}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => actions.navigate('catalog')}>
              Continuar comprando
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Shell>
  );
}
