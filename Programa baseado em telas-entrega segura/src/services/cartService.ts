import type { CartItem, Product } from '../domain/types';

export type AddToCartResult = 'added' | 'seller-conflict' | 'unavailable';

export const cartService = {
  hasSellerConflict(cart: CartItem[], product: Product): boolean {
    return cart.length > 0 && cart[0].product.sellerId !== product.sellerId;
  },

  add(
    cart: CartItem[],
    product: Product,
    qty = 1,
    schedule?: Pick<CartItem, 'schedDate' | 'schedTime'>
  ): { cart: CartItem[]; result: AddToCartResult; pendingItem?: CartItem } {
    const item: CartItem = {
      product,
      qty: Math.max(1, Math.min(qty, product.stock)),
      schedDate: schedule?.schedDate ?? '',
      schedTime: schedule?.schedTime ?? '',
    };
    if (!product.available || product.stock <= 0) return { cart, result: 'unavailable' };
    if (this.hasSellerConflict(cart, product)) {
      return { cart, result: 'seller-conflict', pendingItem: item };
    }
    const existing = cart.find((entry) => entry.product.id === product.id);
    if (!existing) return { cart: [...cart, item], result: 'added' };
    if (existing.qty + qty > product.stock) return { cart, result: 'unavailable' };
    return {
      cart: cart.map((entry) =>
        entry.product.id === product.id
          ? {
              ...entry,
              qty: Math.min(product.stock, entry.qty + qty),
              schedDate: schedule?.schedDate ?? entry.schedDate,
              schedTime: schedule?.schedTime ?? entry.schedTime,
            }
          : entry
      ),
      result: 'added',
    };
  },
};
