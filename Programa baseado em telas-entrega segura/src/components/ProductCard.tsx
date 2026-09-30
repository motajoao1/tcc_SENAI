import type { Product } from '../domain/types';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Badge } from './ui/Badge';
import { CheckIcon, PlusIcon } from './ui/Icons';
import { RatingStars } from './ui/RatingStars';

export interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const { state, actions, findUser } = useApp();
  const seller = findUser(product.sellerId);
  const inCart = state.cart.find((i) => i.product.id === product.id);
  const soldOut = product.stock <= 0;
  const atStockLimit = Boolean(inCart && inCart.qty >= product.stock);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`Ver detalhes de ${product.name}`}
        className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      >
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="h-[110px] w-full bg-gray-100 object-cover md:h-[140px]"
        />
        <span className="absolute left-2 top-2">
          <Badge>{product.category}</Badge>
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="text-left text-sm font-bold leading-snug text-gray-900 hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {product.name}
        </button>

        <p className="truncate text-xs text-gray-500">
          {seller?.sellerProfile?.businessName ?? seller?.name ?? 'Vendedor'} · Apto{' '}
          {seller?.apartment ?? '—'}
        </p>

        <RatingStars value={product.rating} count={product.totalRatings} size={13} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="text-[15px] font-bold text-gray-900">{formatCurrency(product.price)}</p>
          <button
            type="button"
            disabled={soldOut || atStockLimit}
            onClick={() => actions.addToCart(product)}
            aria-label={
              soldOut
                ? `${product.name} esgotado`
                : atStockLimit
                  ? `Quantidade indisponível. Restam ${product.stock} unidades`
                : `Adicionar ${product.name} ao carrinho`
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              inCart ? 'bg-green-600' : 'bg-[#2563EB] active:scale-90'
            }`}
          >
            {inCart ? (
              <span className="flex items-center gap-0.5 text-sm font-bold">
                <CheckIcon size={12} />
                {inCart.qty}
              </span>
            ) : (
              <PlusIcon size={16} />
            )}
          </button>
        </div>

        {soldOut && <p className="text-xs font-semibold text-red-600">Esgotado</p>}
        {!soldOut && atStockLimit && (
          <p className="text-xs font-semibold text-amber-700">
            Quantidade indisponível. Restam {product.stock} unidades.
          </p>
        )}
      </div>
    </article>
  );
}
