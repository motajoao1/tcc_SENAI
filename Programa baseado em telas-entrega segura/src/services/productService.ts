import type { Product } from '../domain/types';
import { generateId } from '../utils/formatters';

/**
 * Pure functions over a products collection. The AppContext owns the state and
 * delegates here so the persistence strategy can be swapped later.
 */
export const productService = {
  listByCondominium(products: Product[], condominiumId: string): Product[] {
    return products.filter((p) => p.condominiumId === condominiumId && p.available);
  },

  listBySeller(products: Product[], sellerId: string): Product[] {
    return products.filter((p) => p.sellerId === sellerId);
  },

  findById(products: Product[], id: string): Product | undefined {
    return products.find((p) => p.id === id);
  },

  create(products: Product[], draft: Omit<Product, 'id'>): { products: Product[]; product: Product } {
    const product: Product = { ...draft, id: `prod-${generateId()}` };
    return { products: [...products, product], product };
  },

  update(products: Product[], id: string, updates: Partial<Product>): Product[] {
    return products.map((p) => (p.id === id ? { ...p, ...updates } : p));
  },

  remove(products: Product[], id: string): Product[] {
    return products.filter((p) => p.id !== id);
  },

  decrementStock(products: Product[], id: string, qty: number): Product[] {
    return products.map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    );
  },

  incrementStock(products: Product[], id: string, qty: number): Product[] {
    return products.map((p) => (p.id === id ? { ...p, stock: p.stock + qty } : p));
  },

  applyRating(products: Product[], id: string, rating: number): Product[] {
    return products.map((p) => {
      if (p.id !== id) return p;
      const totalRatings = p.totalRatings + 1;
      const avg = (p.rating * p.totalRatings + rating) / totalRatings;
      return { ...p, totalRatings, rating: Math.round(avg * 10) / 10 };
    });
  },
};
