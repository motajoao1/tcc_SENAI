import type { Screen } from '../../domain/types';
import type { ActiveMode } from '../../context/AppContext';

export interface NavItem {
  key: string;
  label: string;
  screen: Screen;
  /** Screens that should highlight this tab. */
  matches: Screen[];
  icon: 'home' | 'receipt' | 'user' | 'chart' | 'box';
}

export const BUYER_NAV: NavItem[] = [
  {
    key: 'catalog',
    label: 'Início',
    screen: 'catalog',
    matches: ['catalog', 'product-detail', 'cart', 'checkout', 'order-confirmation'],
    icon: 'home',
  },
  {
    key: 'orders',
    label: 'Pedidos',
    screen: 'orders',
    matches: ['orders', 'order-detail'],
    icon: 'receipt',
  },
  {
    key: 'profile',
    label: 'Perfil',
    screen: 'profile',
    matches: ['profile', 'enable-seller', 'privacy', 'condo-rules'],
    icon: 'user',
  },
];

export const SELLER_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', screen: 'seller-dashboard', matches: ['seller-dashboard'], icon: 'chart' },
  { key: 'sorders', label: 'Pedidos', screen: 'seller-orders', matches: ['seller-orders'], icon: 'receipt' },
  {
    key: 'sproducts',
    label: 'Produtos',
    screen: 'seller-products',
    matches: ['seller-products', 'seller-product-form'],
    icon: 'box',
  },
  {
    key: 'profile',
    label: 'Perfil',
    screen: 'profile',
    matches: ['profile', 'privacy', 'condo-rules'],
    icon: 'user',
  },
];

export const navForMode = (mode: ActiveMode): NavItem[] =>
  mode === 'seller' ? SELLER_NAV : BUYER_NAV;
