import type { CartItem, Condominium, Product } from '../domain/types';
import { formatWeekdays, todayISO } from '../utils/formatters';

export interface ScheduleValidation {
  valid: boolean;
  message?: string;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export function validateSchedule({
  condominium,
  product,
  date,
  time,
}: {
  condominium: Condominium | null;
  product: Product;
  date: string;
  time: string;
}): ScheduleValidation {
  if (product.type !== 'service') return { valid: true };
  if (!date || !time) return { valid: false, message: 'Informe data e horário para agendar o serviço.' };
  if (date < todayISO()) return { valid: false, message: 'A data do serviço não pode estar no passado.' };

  const day = new Date(`${date}T12:00:00`).getDay();
  const condominiumDays = condominium?.allowedDays ?? [];
  if (condominiumDays.length > 0 && !condominiumDays.includes(day)) {
    return {
      valid: false,
      message: `Serviços neste condomínio são permitidos em: ${formatWeekdays(condominiumDays)}.`,
    };
  }
  const providerDays = product.availableDays ?? [];
  if (providerDays.length > 0 && !providerDays.includes(day)) {
    return { valid: false, message: `Este serviço atende apenas: ${formatWeekdays(providerDays)}.` };
  }

  const start = Math.max(
    (condominium?.allowedHours.start ?? 0) * 60,
    product.availableStart ? toMinutes(product.availableStart) : 0
  );
  const end = Math.min(
    (condominium?.allowedHours.end ?? 24) * 60,
    product.availableEnd ? toMinutes(product.availableEnd) : 24 * 60
  );
  const selected = toMinutes(time);
  if (!Number.isFinite(selected) || selected < start || selected > end) {
    return {
      valid: false,
      message: `Este horário não está disponível. Escolha entre ${formatMinutes(start)} e ${formatMinutes(end)}.`,
    };
  }
  return { valid: true };
}

export function validateCartSchedules(
  items: CartItem[],
  condominium: Condominium | null
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const item of items) {
    const result = validateSchedule({
      condominium,
      product: item.product,
      date: item.schedDate,
      time: item.schedTime,
    });
    if (!result.valid) errors[item.product.id] = result.message ?? 'Este horário não está disponível.';
  }
  return errors;
}
