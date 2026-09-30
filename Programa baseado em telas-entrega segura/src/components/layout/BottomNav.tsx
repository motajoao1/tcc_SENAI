import { useApp } from '../../context/AppContext';
import { BoxIcon, ChartIcon, HomeIcon, ReceiptIcon, UserIcon } from '../ui/Icons';
import { navForMode } from './navItems';
import type { NavItem } from './navItems';

const ICONS = {
  home: HomeIcon,
  receipt: ReceiptIcon,
  user: UserIcon,
  chart: ChartIcon,
  box: BoxIcon,
};

export function BottomNav() {
  const { state, actions } = useApp();
  const items = navForMode(state.activeMode);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  const isActive = (item: NavItem) => item.matches.includes(state.currentScreen);

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-40 flex shrink-0 border-t border-gray-200 bg-white lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(item);
        const showBadge = item.key === 'catalog' && cartCount > 0;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => actions.navigate(item.screen)}
            aria-current={active ? 'page' : undefined}
            className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
              active ? 'text-[#2563EB]' : 'text-gray-500'
            }`}
          >
            <Icon size={22} />
            <span className="text-xs font-semibold">{item.label}</span>
            {showBadge && (
              <span className="absolute right-[22%] top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
