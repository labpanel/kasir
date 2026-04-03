import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // --- Auth State ---
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // --- Setting State ---
      settings: {
        storeName: 'Toko Saya',
        storeAddress: 'Jl. Merdeka No. 123',
        storePhone: '081234567890',
        currency: 'Rp',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        thermalPrinter: '58mm',
      },
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      // --- Cart State (POS) ---
      cart: [],
      addToCart: (product, qty = 1) => set((state) => {
        const existing = state.cart.find((item) => item.code === product.code);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.code === product.code
                ? { ...item, qty: item.qty + qty }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, qty }] };
      }),
      updateCartItemQty: (code, qty) => set((state) => ({
        cart: state.cart.map((item) => 
          item.code === code ? { ...item, qty } : item
        )
      })),
      removeFromCart: (code) => set((state) => ({
        cart: state.cart.filter((item) => item.code !== code)
      })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'kasir-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ user: state.user, settings: state.settings }), // don't persist cart
    }
  )
);

export default useStore;
