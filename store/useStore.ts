import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, OrderItem, Product, Notification } from '../types';
import { api } from '../services/mockBackend';

// --- Cart Store ---
interface CartState {
  items: OrderItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => set((state) => {
        const existing = state.items.find((i) => i.productId === product.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          };
        }
        return {
          items: [...state.items, { 
            productId: product.id, 
            productName: product.name, 
            price: product.price, 
            quantity: 1,
            imageUrl: product.imageUrl 
          }],
          isOpen: true,
        };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.productId !== id) })),
      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map((i) => {
          if (i.productId === id) {
            const newQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQty };
          }
          return i;
        })
      })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'eflyer-cart-storage' }
  )
);

// --- Auth Store ---
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        api.logout();
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'eflyer-auth-storage' }
  )
);

// --- UI & Notification Store ---
interface UIState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  notifications: [],
  theme: 'light',
  addNotification: (n) => set((state) => ({
    notifications: [
      { ...n, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), read: false },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
