import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  CartItem,
  Condominium,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  RegisterData,
  Screen,
  SellerProfile,
  User,
} from '../domain/types';
import {
  CONDOMINIUMS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_USERS,
  VALID_RESIDENT_UNITS,
} from '../data/mockData';
import { cartService, type AddToCartResult } from '../services/cartService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { residentValidationService } from '../services/residentValidationService';
import { validateCartSchedules } from '../services/scheduleService';
import { userService } from '../services/userService';
import { generateId } from '../utils/formatters';
import { AppContext } from './AppContextCore';

export { useApp } from './AppContextCore';

export type ActiveMode = 'buyer' | 'seller';

export interface AppState {
  currentUser: User | null;
  currentScreen: Screen;
  screenParams: Record<string, unknown>;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  lastOrder: Order | null;
  condominiums: Condominium[];
  users: User[];
  activeMode: ActiveMode;
  pendingCartItem: CartItem | null;
  checkoutError: string;
}

export interface AppActions {
  navigate: (screen: Screen, params?: Record<string, unknown>) => void;
  login: (email: string, password: string) => User | null;
  register: (data: RegisterData) => User;
  logout: () => void;
  restartRegistration: () => void;
  setActiveMode: (mode: ActiveMode) => void;
  addToCart: (
    product: Product,
    qty?: number,
    schedule?: Pick<CartItem, 'schedDate' | 'schedTime'>
  ) => AddToCartResult;
  keepCurrentCart: () => void;
  replaceCartWithPendingItem: () => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  updateCartSchedule: (productId: string, date: string, time: string) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: PaymentMethod) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  confirmReceipt: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  enableSeller: (sellerProfile: SellerProfile) => void;
  rateOrder: (
    orderId: string,
    role: 'buyer' | 'seller',
    rating: number,
    comment?: string
  ) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  validateCurrentResident: () => 'approved' | 'rejected';
  deleteAccount: () => void;
}

export interface AppContextValue {
  state: AppState;
  actions: AppActions;
  /** Condominium of the logged-in user, when available. */
  condominium: Condominium | null;
  findUser: (id: string) => User | undefined;
}

const INITIAL_STATE: AppState = {
  currentUser: null,
  currentScreen: 'welcome',
  screenParams: {},
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  cart: [],
  lastOrder: null,
  condominiums: CONDOMINIUMS,
  users: SEED_USERS,
  activeMode: 'buyer',
  pendingCartItem: null,
  checkoutError: '',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const navigate = useCallback((screen: Screen, params: Record<string, unknown> = {}) => {
    setState((s) => ({ ...s, currentScreen: screen, screenParams: params }));
  }, []);

  const login = useCallback(
    (email: string, password: string): User | null => {
      const user = userService.authenticate(state.users, email, password);
      if (!user) return null;
      setState((s) => ({
        ...s,
        currentUser: user,
        activeMode: 'buyer',
        currentScreen: 'catalog',
        screenParams: {},
        cart: [],
      }));
      return user;
    },
    [state.users]
  );

  const register = useCallback((data: RegisterData): User => {
    const user = userService.createUser(data);
    setState((s) => ({
      ...s,
      users: [...s.users, user],
      currentUser: user,
      activeMode: 'buyer',
      currentScreen: 'validation',
      screenParams: {},
      cart: [],
    }));
    return user;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({
      ...s,
      currentUser: null,
      currentScreen: 'welcome',
      screenParams: {},
      cart: [],
      lastOrder: null,
      activeMode: 'buyer',
    }));
  }, []);

  const restartRegistration = useCallback(() => {
    setState((s) => {
      if (!s.currentUser || s.currentUser.validated) return s;
      const temporaryUserId = s.currentUser.id;
      return {
        ...s,
        users: s.users.filter((user) => user.id !== temporaryUserId),
        currentUser: null,
        currentScreen: 'register',
        screenParams: {},
        cart: [],
        lastOrder: null,
        activeMode: 'buyer',
        pendingCartItem: null,
        checkoutError: '',
      };
    });
  }, []);

  const setActiveMode = useCallback((mode: ActiveMode) => {
    setState((s) => ({
      ...s,
      activeMode: mode,
      currentScreen: mode === 'seller' ? 'seller-dashboard' : 'catalog',
      screenParams: {},
    }));
  }, []);

  const addToCart = useCallback(
    (
      product: Product,
      qty = 1,
      schedule?: Pick<CartItem, 'schedDate' | 'schedTime'>
    ): AddToCartResult => {
      const result = cartService.add(state.cart, product, qty, schedule);
      setState((s) => ({
        ...s,
        cart: result.cart,
        pendingCartItem: result.pendingItem ?? null,
        checkoutError:
          result.result === 'unavailable'
            ? `Quantidade indisponível. Restam ${product.stock} unidades.`
            : '',
      }));
      return result.result;
    },
    [state.cart]
  );

  const keepCurrentCart = useCallback(() => {
    setState((s) => ({ ...s, pendingCartItem: null }));
  }, []);

  const replaceCartWithPendingItem = useCallback(() => {
    setState((s) => {
      if (!s.pendingCartItem) return s;
      return { ...s, cart: [s.pendingCartItem], pendingCartItem: null, checkoutError: '' };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((i) => i.product.id !== productId) }));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setState((s) => {
      const product = s.products.find((entry) => entry.id === productId);
      if (qty > (product?.stock ?? 0)) {
        return {
          ...s,
          checkoutError: `Quantidade indisponível. Restam ${product?.stock ?? 0} unidades.`,
        };
      }
      return {
        ...s,
        checkoutError: '',
        cart:
          qty <= 0
            ? s.cart.filter((i) => i.product.id !== productId)
            : s.cart.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
      };
    });
  }, []);

  const updateCartSchedule = useCallback((productId: string, date: string, time: string) => {
    setState((s) => ({
      ...s,
      cart: s.cart.map((i) =>
        i.product.id === productId ? { ...i, schedDate: date, schedTime: time } : i
      ),
    }));
  }, []);

  const clearCart = useCallback(
    () => setState((s) => ({ ...s, cart: [], pendingCartItem: null, checkoutError: '' })),
    []
  );

  const placeOrder = useCallback(
    (paymentMethod: PaymentMethod): Order | null => {
      const { currentUser, cart } = state;
      if (!currentUser || cart.length === 0) return null;
      const sellers = new Set(cart.map((item) => item.product.sellerId));
      const currentCondominium =
        state.condominiums.find((c) => c.id === currentUser.condominiumId) ?? null;
      const scheduleErrors = validateCartSchedules(cart, currentCondominium);
      if (sellers.size !== 1 || Object.keys(scheduleErrors).length > 0) {
        setState((s) => ({
          ...s,
          checkoutError:
            sellers.size !== 1
              ? 'O carrinho deve conter itens de apenas um vendedor.'
              : Object.values(scheduleErrors)[0],
        }));
        return null;
      }
      for (const item of cart) {
        const currentProduct = state.products.find((product) => product.id === item.product.id);
        if (!currentProduct || !currentProduct.available || item.qty > currentProduct.stock) {
          setState((s) => ({
            ...s,
            checkoutError: `Quantidade indisponível. Restam ${currentProduct?.stock ?? 0} unidades.`,
          }));
          return null;
        }
      }
      // Built outside the state updater so the updater stays pure (StrictMode
      // double-invokes updaters in development).
      const order = orderService.create(
        cart,
        currentUser.id,
        currentUser.condominiumId,
        paymentMethod
      );
      setState((s) => {
        let products = s.products;
        for (const item of order.items) {
          products = productService.decrementStock(products, item.product.id, item.qty);
        }
        return {
          ...s,
          orders: [...s.orders, order],
          products,
          cart: [],
          lastOrder: order,
          checkoutError: '',
        };
      });
      return order;
    },
    [state]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setState((s) => {
      const current = s.orders.find((order) => order.id === orderId);
      if (!current || !orderService.nextStatuses(current.status).includes(status)) return s;
      let products = s.products;
      if (status === 'cancelled') {
        for (const item of current.items) {
          products = productService.incrementStock(products, item.product.id, item.qty);
        }
      }
      const orders = orderService.updateStatus(s.orders, orderId, status);
      const updatedLastOrder =
        s.lastOrder?.id === orderId ? orders.find((order) => order.id === orderId) ?? null : s.lastOrder;
      return { ...s, orders, products, lastOrder: updatedLastOrder };
    });
  }, []);

  const confirmReceipt = useCallback((orderId: string) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((order) =>
        order.id === orderId && order.status === 'delivered' && !order.receiptConfirmedAt
          ? { ...order, receiptConfirmedAt: new Date().toISOString() }
          : order
      ),
    }));
  }, []);

  const addProduct = useCallback((draft: Omit<Product, 'id'>): Product => {
    const product: Product = { ...draft, id: `prod-${generateId()}` };
    setState((s) => ({ ...s, products: [...s.products, product] }));
    return product;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setState((s) => ({ ...s, products: productService.update(s.products, id, updates) }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((s) => ({ ...s, products: productService.remove(s.products, id) }));
  }, []);

  const enableSeller = useCallback((sellerProfile: SellerProfile) => {
    setState((s) => {
      if (!s.currentUser) return s;
      const updated = userService.enableSeller(s.currentUser, sellerProfile);
      return {
        ...s,
        currentUser: updated,
        users: s.users.map((u) => (u.id === updated.id ? updated : u)),
      };
    });
  }, []);

  const rateOrder = useCallback(
    (orderId: string, role: 'buyer' | 'seller', rating: number, comment = '') => {
      setState((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order) return s;
        if (
          order.status !== 'delivered' ||
          (role === 'buyer' && (!order.receiptConfirmedAt || order.buyerRating !== undefined)) ||
          (role === 'seller' && order.sellerRating !== undefined) ||
          rating < 1 ||
          rating > 5
        ) {
          return s;
        }
        const orders = s.orders.map((o) =>
          o.id === orderId
            ? role === 'buyer'
              ? { ...o, buyerRating: rating, buyerComment: comment }
              : { ...o, sellerRating: rating, sellerComment: comment }
            : o
        );
        let products = s.products;
        let users = s.users;
        if (role === 'buyer') {
          for (const item of order.items) {
            products = productService.applyRating(products, item.product.id, rating);
          }
          users = users.map((u) =>
            u.id === order.sellerId ? userService.applyRating(u, rating) : u
          );
        } else {
          users = users.map((u) =>
            u.id === order.buyerId ? userService.applyRating(u, rating) : u
          );
        }
        const currentUser =
          s.currentUser && users.find((u) => u.id === s.currentUser?.id)
            ? users.find((u) => u.id === s.currentUser?.id) ?? s.currentUser
            : s.currentUser;
        return { ...s, orders, products, users, currentUser };
      });
    },
    []
  );

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    setState((s) => {
      if (!s.currentUser) return s;
      const updated = { ...s.currentUser, ...updates };
      return {
        ...s,
        currentUser: updated,
        users: s.users.map((u) => (u.id === updated.id ? updated : u)),
      };
    });
  }, []);

  const validateCurrentResident = useCallback((): 'approved' | 'rejected' => {
    if (!state.currentUser) return 'rejected';
    const result = residentValidationService.validate(
      VALID_RESIDENT_UNITS,
      state.currentUser.condominiumId,
      state.currentUser.block,
      state.currentUser.apartment
    );
    if (result === 'approved') updateCurrentUser({ validated: true });
    return result;
  }, [state.currentUser, updateCurrentUser]);

  const deleteAccount = useCallback(() => {
    setState((s) => {
      if (!s.currentUser) return s;
      const id = s.currentUser.id;
      const anonymousId = `removed-${id}`;
      const anonymousUser: User = {
        id: anonymousId,
        name: 'Usuário removido',
        email: '',
        cpf: '',
        condominiumId: s.currentUser.condominiumId,
        block: '—',
        apartment: '—',
        role: 'buyer',
        rating: 0,
        totalRatings: 0,
        validated: false,
      };
      const preservedOrders = s.orders
        .filter((order) => {
          const belongsToUser = order.buyerId === id || order.sellerId === id;
          return !belongsToUser || order.status === 'delivered' || order.status === 'cancelled';
        })
        .map((order) => ({
          ...order,
          buyerId: order.buyerId === id ? anonymousId : order.buyerId,
          sellerId: order.sellerId === id ? anonymousId : order.sellerId,
        }));
      let products = s.products.filter((product) => product.sellerId !== id);
      for (const order of s.orders) {
        if (
          (order.buyerId === id || order.sellerId === id) &&
          order.status !== 'delivered' &&
          order.status !== 'cancelled'
        ) {
          for (const item of order.items) {
            products = productService.incrementStock(products, item.product.id, item.qty);
          }
        }
      }
      return {
        ...s,
        users: [...s.users.filter((u) => u.id !== id), anonymousUser],
        products,
        orders: preservedOrders,
        currentUser: null,
        cart: [],
        lastOrder: null,
        currentScreen: 'welcome',
        screenParams: {},
        activeMode: 'buyer',
      };
    });
  }, []);

  const actions = useMemo<AppActions>(
    () => ({
      navigate,
      login,
      register,
      logout,
      restartRegistration,
      setActiveMode,
      addToCart,
      keepCurrentCart,
      replaceCartWithPendingItem,
      removeFromCart,
      updateCartQty,
      updateCartSchedule,
      clearCart,
      placeOrder,
      updateOrderStatus,
      confirmReceipt,
      addProduct,
      updateProduct,
      deleteProduct,
      enableSeller,
      rateOrder,
      updateCurrentUser,
      validateCurrentResident,
      deleteAccount,
    }),
    [
      navigate,
      login,
      register,
      logout,
      restartRegistration,
      setActiveMode,
      addToCart,
      keepCurrentCart,
      replaceCartWithPendingItem,
      removeFromCart,
      updateCartQty,
      updateCartSchedule,
      clearCart,
      placeOrder,
      updateOrderStatus,
      confirmReceipt,
      addProduct,
      updateProduct,
      deleteProduct,
      enableSeller,
      rateOrder,
      updateCurrentUser,
      validateCurrentResident,
      deleteAccount,
    ]
  );

  const condominium = useMemo(
    () =>
      state.currentUser
        ? state.condominiums.find((c) => c.id === state.currentUser?.condominiumId) ?? null
        : null,
    [state.currentUser, state.condominiums]
  );

  const findUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users]
  );

  const value = useMemo<AppContextValue>(
    () => ({ state, actions, condominium, findUser }),
    [state, actions, condominium, findUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
