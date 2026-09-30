import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';
import { BoxIcon, ChartIcon, HomeIcon, ReceiptIcon, UserIcon } from '../ui/Icons';
import { navForMode } from './navItems';

const ICONS = {
  home: HomeIcon,
  receipt: ReceiptIcon,
  user: UserIcon,
  chart: ChartIcon,
  box: BoxIcon,
};

export function Sidebar() {
  const { state, actions, condominium } = useApp();
  const items = navForMode(state.activeMode);
  const user = state.currentUser;

  return (
    <aside
      aria-label="Navegação lateral"
      className="hidden w-[220px] shrink-0 flex-col gap-6 border-r border-gray-200 bg-white px-4 py-6 lg:flex"
    >
      <img src="/assets/f7824.png" alt="Entrega Fácil" className="h-auto w-[140px]" />

      {user && (
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">
              {condominium?.name ?? 'Condomínio'}
            </p>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.matches.includes(state.currentScreen);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => actions.navigate(item.screen)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                active
                  ? 'bg-blue-50 text-[#1D4ED8]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {state.activeMode === 'buyer' && (
        <button
          type="button"
          onClick={() => actions.navigate('cart')}
          className="flex min-h-[44px] items-center justify-between rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Carrinho
          <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-xs font-bold text-white">
            {state.cart.reduce((s, i) => s + i.qty, 0)}
          </span>
        </button>
      )}

      {user?.role === 'both' && (
        <button
          type="button"
          onClick={() => actions.setActiveMode(state.activeMode === 'seller' ? 'buyer' : 'seller')}
          className="mt-auto min-h-[44px] rounded-xl bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {state.activeMode === 'seller' ? 'Modo comprador' : 'Modo vendedor'}
        </button>
      )}
    </aside>
  );
}
