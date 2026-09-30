import { createContext, useContext } from 'react';
import type { AppContextValue } from './AppContext';

/**
 * Kept separate from the provider implementation so Vite Fast Refresh does
 * not create a new context identity while preserving an older provider tree.
 */
export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return context;
}
