import type { Order, OrderStatus } from '../domain/types';
import { STATUS_COLORS } from './ui/Badge';
import { CheckIcon } from './ui/Icons';
import { TIMELINE_STEPS } from '../services/orderService';
import { formatDate } from '../utils/formatters';

const STEP_HINTS: Record<OrderStatus, string> = {
  pending: 'Pedido enviado ao vendedor',
  confirmed: 'Vendedor aceitou o pedido',
  preparing: 'Seu pedido está sendo preparado',
  ready: 'Pronto para entrega ou retirada',
  delivering: 'A caminho do seu apartamento',
  delivered: 'Pedido entregue',
  cancelled: 'Pedido cancelado',
};

export function StatusTimeline({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="rounded-2xl bg-red-50 p-4">
        <p className="text-sm font-bold text-red-800">Pedido cancelado</p>
        <p className="mt-1 text-sm text-red-700">
          Este pedido foi cancelado em {formatDate(order.updatedAt)}.
        </p>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(order.status);

  return (
    <ol className="flex flex-col">
      {TIMELINE_STEPS.map((step, i) => {
        const past = i < currentIndex;
        const current = i === currentIndex;
        const isLast = i === TIMELINE_STEPS.length - 1;
        const circle = past
          ? 'bg-green-600 text-white'
          : current
            ? 'bg-[#2563EB] text-white'
            : 'bg-gray-200 text-gray-500';

        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${circle}`}
                aria-hidden
              >
                {past ? <CheckIcon size={14} /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 ${past ? 'bg-green-600' : 'bg-gray-200'}`}
                  style={{ minHeight: 26 }}
                  aria-hidden
                />
              )}
            </div>
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-sm font-bold ${
                  current ? 'text-[#1D4ED8]' : past ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {STATUS_COLORS[step].label}
              </p>
              <p className={`text-sm ${current || past ? 'text-gray-600' : 'text-gray-400'}`}>
                {STEP_HINTS[step]}
              </p>
              {current && (
                <p className="mt-0.5 text-sm text-gray-500">
                  Atualizado em {formatDate(order.updatedAt)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
