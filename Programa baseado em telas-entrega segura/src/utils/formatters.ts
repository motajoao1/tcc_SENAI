import { WEEKDAY_LABELS } from '../domain/types';

export const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = dateStr.length === 10 ? new Date(`${dateStr}T12:00:00`) : new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const maskCPF = (v: string) =>
  v
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const maskCEP = (v: string) =>
  v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export const maskPhone = (v: string) =>
  v
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2');

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateCPF = (cpf: string) => cpf.replace(/\D/g, '').length === 11;

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const formatWeekdays = (days: number[]) => {
  if (!days.length) return 'Nenhum dia';
  const sorted = [...days].sort((a, b) => a - b);
  const contiguous = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (contiguous && sorted.length > 2) {
    return `${WEEKDAY_LABELS[sorted[0]]} a ${WEEKDAY_LABELS[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((d) => WEEKDAY_LABELS[d]).join(', ');
};

export const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export const todayISO = () => new Date().toISOString().slice(0, 10);
