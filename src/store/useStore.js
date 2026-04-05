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
        storeEmail: 'info@tokosaya.com',
        storeWebsite: 'www.tokosaya.com',
        currency: 'Rp',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        thermalPrinter: '58mm',
      },
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      // --- Quotation Template Settings ---
      quotationSettings: {
        template: 'professional', // 'professional', 'minimalist', 'classic', 'thermal'
        thermalPaperWidth: '58mm', // '58mm' or '80mm'
        validityDays: 14,
        terms: [
          'Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.',
          'Penawaran ini berlaku selama 14 hari sejak tanggal diterbitkan.',
          'Pembayaran dilakukan sesuai kesepakatan bersama.',
        ],
        signatureLeft: 'Pelanggan',
        signatureRight: 'Hormat Kami',
        signatureLeftImage: '',  // base64 data URL
        signatureRightImage: '', // base64 data URL
        showLogo: true,
        headerTitle: 'QUOTATION',
        headerSubtitle: 'Penawaran Harga',
        showStoreAddress: true,
        showStorePhone: true,
        showStoreEmail: false,
        showStoreWebsite: false,
        accentColor: '#1e40af',
        footerText: '',
      },
      updateQuotationSettings: (newSettings) =>
        set((state) => ({ quotationSettings: { ...state.quotationSettings, ...newSettings } })),

      // --- Transaction Template Settings ---
      transactionSettings: {
        template: 'thermal', // 'professional', 'minimalist', 'classic', 'thermal'
        thermalPaperWidth: '58mm', // '58mm' or '80mm'
        signatureLeft: 'Pelanggan',
        signatureRight: 'Kasir',
        signatureLeftImage: '',  // base64 data URL
        signatureRightImage: '', // base64 data URL
        showLogo: true,
        headerTitle: 'INVOICE',
        headerSubtitle: 'Nota Transaksi',
        showStoreAddress: true,
        showStorePhone: true,
        showStoreEmail: false,
        showStoreWebsite: false,
        accentColor: '#1e40af',
        footerText: 'Terima kasih atas kunjungan Anda • Barang yang sudah dibeli tidak dapat dikembalikan',
        notes: '',
      },
      updateTransactionSettings: (newSettings) =>
        set((state) => ({ transactionSettings: { ...state.transactionSettings, ...newSettings } })),

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

      // --- Role Permissions ---
      rolePermissions: {
        // Admin always has full access (handled in code, not here)
        // This defines what 'User'/'Pegawai' role can access
        userPermissions: ['dashboard', 'transaksi', 'stok', 'quotation'],
      },
      updateRolePermissions: (newPerms) =>
        set((state) => ({ rolePermissions: { ...state.rolePermissions, ...newPerms } })),

      // --- API Error State ---
      apiError: null,
      setApiError: (error) => set({ apiError: error }),
    }),
    {
      name: 'kasir-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        user: state.user, 
        settings: state.settings, 
        quotationSettings: state.quotationSettings, 
        transactionSettings: state.transactionSettings,
        rolePermissions: state.rolePermissions 
      }),
    }
  )
);

export default useStore;
