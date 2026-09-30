export type UserRole = 'buyer' | 'both';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash';

export type PaymentStatus = 'pending' | 'approved';

export type ProductCategory =
  | 'Alimentos'
  | 'Serviços'
  | 'Roupas'
  | 'Beleza'
  | 'Artesanato'
  | 'Outros';

export type Screen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'validation'
  | 'forgot-password'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'orders'
  | 'order-detail'
  | 'profile'
  | 'enable-seller'
  | 'privacy'
  | 'condo-rules'
  | 'seller-dashboard'
  | 'seller-orders'
  | 'seller-products'
  | 'seller-product-form';

export interface Condominium {
  id: string;
  name: string;
  address: string;
  allowedHours: { start: number; end: number };
  allowedDays: number[];
}

export interface SellerProfile {
  businessName: string;
  category: ProductCategory;
  description: string;
  phone: string;
  hours: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  condominiumId: string;
  block: string;
  apartment: string;
  role: UserRole;
  sellerProfile?: SellerProfile;
  rating: number;
  totalRatings: number;
  validated: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  condominiumId: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  stock: number;
  category: ProductCategory;
  img: string;
  type: 'product' | 'service';
  available: boolean;
  rating: number;
  totalRatings: number;
  duration?: string;
  availableDays?: number[];
  availableStart?: string;
  availableEnd?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  schedDate: string;
  schedTime: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  condominiumId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string;
  updatedAt: string;
  receiptConfirmedAt?: string;
  buyerRating?: number;
  sellerRating?: number;
  buyerComment?: string;
  sellerComment?: string;
}

export interface ValidResidentUnit {
  condominiumId: string;
  block: string;
  apartment: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  condominiumId: string;
  block: string;
  apartment: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Alimentos',
  'Serviços',
  'Roupas',
  'Beleza',
  'Artesanato',
  'Outros',
];

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
