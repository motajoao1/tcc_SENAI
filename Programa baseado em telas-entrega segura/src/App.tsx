import { AppProvider, useApp } from './context/AppContext';
import type { Screen } from './domain/types';
import { CartSellerConflictModal } from './components/CartSellerConflictModal';

// Buyer screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ValidationScreen } from './screens/ValidationScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmationScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { OrderDetailScreen } from './screens/OrderDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EnableSellerScreen } from './screens/EnableSellerScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { CondoRulesScreen } from './screens/CondoRulesScreen';

// Seller screens
import { SellerDashboardScreen } from './screens/seller/SellerDashboardScreen';
import { SellerOrdersScreen } from './screens/seller/SellerOrdersScreen';
import { SellerProductsScreen } from './screens/seller/SellerProductsScreen';
import { SellerProductFormScreen } from './screens/seller/SellerProductFormScreen';

const SCREEN_MAP: Record<Screen, React.ComponentType> = {
  welcome: WelcomeScreen,
  login: LoginScreen,
  register: RegisterScreen,
  validation: ValidationScreen,
  'forgot-password': ForgotPasswordScreen,
  catalog: CatalogScreen,
  'product-detail': ProductDetailScreen,
  cart: CartScreen,
  checkout: CheckoutScreen,
  'order-confirmation': OrderConfirmationScreen,
  orders: OrdersScreen,
  'order-detail': OrderDetailScreen,
  profile: ProfileScreen,
  'enable-seller': EnableSellerScreen,
  privacy: PrivacyScreen,
  'condo-rules': CondoRulesScreen,
  'seller-dashboard': SellerDashboardScreen,
  'seller-orders': SellerOrdersScreen,
  'seller-products': SellerProductsScreen,
  'seller-product-form': SellerProductFormScreen,
};

function Router() {
  const { state } = useApp();
  const protectedScreens: Screen[] = [
    'catalog',
    'product-detail',
    'cart',
    'checkout',
    'order-confirmation',
    'orders',
    'order-detail',
    'profile',
    'enable-seller',
    'condo-rules',
    'seller-dashboard',
    'seller-orders',
    'seller-products',
    'seller-product-form',
  ];
  const requiresValidation =
    state.currentUser !== null &&
    !state.currentUser.validated &&
    protectedScreens.includes(state.currentScreen);
  const Component = requiresValidation
    ? ValidationScreen
    : (SCREEN_MAP[state.currentScreen] ?? WelcomeScreen);
  return (
    <>
      <Component />
      <CartSellerConflictModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
