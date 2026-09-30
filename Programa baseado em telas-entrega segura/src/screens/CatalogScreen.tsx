import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { BellIcon, CartIcon, SearchIcon } from '../components/ui/Icons';
import { PRODUCT_CATEGORIES } from '../domain/types';
import type { Product, ProductCategory } from '../domain/types';
import { productService } from '../services/productService';

type CategoryFilter = 'Todos' | ProductCategory;

export function CatalogScreen() {
  const { state, actions, condominium } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Todos');

  const user = state.currentUser;
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const activeOrders = state.orders.filter(
    (o) => o.buyerId === user?.id && o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const available = useMemo(
    () => (user ? productService.listByCondominium(state.products, user.condominiumId) : []),
    [state.products, user]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return available.filter(
      (p) =>
        (category === 'Todos' || p.category === category) &&
        (q === '' ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q))
    );
  }, [available, category, search]);

  const featured = useMemo(
    () => [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [filtered]
  );
  const services = filtered.filter((p) => p.type === 'service');

  const openProduct = (product: Product) =>
    actions.navigate('product-detail', { productId: product.id });

  const categories: CategoryFilter[] = ['Todos', ...PRODUCT_CATEGORIES];

  return (
    <Shell nav>
      <PageHeader
        eyebrow={condominium?.name}
        title={`Olá, ${user?.name.split(' ')[0] ?? 'morador'}!`}
        right={
          <>
            <button
              type="button"
              aria-label={`Notificações: ${activeOrders} pedidos em andamento`}
              onClick={() => actions.navigate('orders')}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <BellIcon size={22} />
              {activeOrders > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </button>
            <button
              type="button"
              aria-label={`Carrinho com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
              onClick={() => actions.navigate('cart')}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <CartIcon size={22} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </>
        }
      />

      <div className="shrink-0 border-b border-gray-100 bg-white px-4 pb-3 md:px-6">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon size={18} />
          </span>
          <label htmlFor="catalog-search" className="sr-only">
            Buscar produtos e serviços
          </label>
          <input
            id="catalog-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O que você procura hoje?"
            className="min-h-[48px] w-full rounded-xl bg-gray-100 pl-10 pr-4 text-[15px] text-gray-900 placeholder-gray-500 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </div>

        <div className="scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? 'bg-[#2563EB] text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="px-4 py-4 md:px-6">
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum resultado encontrado"
            subtitle="Tente outro termo de busca ou selecione outra categoria."
            actionLabel="Limpar filtros"
            onAction={() => {
              setSearch('');
              setCategory('Todos');
            }}
          />
        ) : (
          <div className="flex flex-col gap-7">
            {featured.length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-bold text-gray-900">Em destaque</h2>
                <div className="scrollbar-hidden -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
                  {featured.map((p) => (
                    <div key={p.id} className="w-[190px] shrink-0">
                      <ProductCard product={p} onOpen={openProduct} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {services.length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-bold text-gray-900">
                  Serviços disponíveis
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {services.map((p) => (
                    <ProductCard key={p.id} product={p} onOpen={openProduct} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-base font-bold text-gray-900">Todos os produtos</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={openProduct} />
                ))}
              </div>
            </section>
          </div>
        )}
      </ScrollArea>
    </Shell>
  );
}
