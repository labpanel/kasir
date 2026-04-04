const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBXqsIqwwvpg4G097FGrMifV5yQ42hSi3Zq3BRstZmfwnrrZ-N1KgGJChTFlLFNHu8mg/exec';

// Set to true for local-only authentication and data management
const MOCK_MODE = false;

const request = async (action, data = null, method = 'GET') => {
  console.log(`[API Request] ${action}`, data);
  try {
    let url = SCRIPT_URL;
    let options = { method };

    if (method === 'GET') {
      url += `?action=${action}`;
    } else {
      // Use text/plain to avoid CORS preflight (OPTIONS request) which GAS doPost doesn't handle well
      options.body = JSON.stringify({ action, data });
      options.headers = { 'Content-Type': 'text/plain' };
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const result = await res.json();
    console.log(`[API Response] ${action}`, result);
    return result;
  } catch (err) {
    console.error(`[API Error] ${action}`, err);
    throw err;
  }
};

export const api = {
  async verifyLogin(email, password) {
    if (MOCK_MODE) {
      // Allow any login for testing or a specific one
      if (email === 'admin@gmail.com' && password === '1234') {
        return { success: true, user: { email, role: 'Admin', name: 'Administrator' } };
      }
      if (email === 'kasir@gmail.com' && password === '1234') {
        return { success: true, user: { email, role: 'Pegawai', name: 'Kasir Utama' } };
      }
      return { success: false, error: 'Email atau password salah (Local Mode: coba admin@gmail.com / 1234)' };
    }
    return await request('verifyLogin', { email, password }, 'POST');
  },
  async registerUser(email, password, name) {
    if (MOCK_MODE) {
      return { success: true };
    }
    return await request('registerUser', { email, password, name }, 'POST');
  },
  async resetPassword(email, newPassword) {
    if (MOCK_MODE) {
      return { success: true };
    }
    return await request('resetPassword', { email, newPassword }, 'POST');
  },

  // PRODUCTS
  async getProducts() {
    if (MOCK_MODE) return [
      { code: 'MOCK001', name: 'Produk Contoh A', category: 'Umum', purchasePrice: 10000, sellingPrice: 15000, stock: 10 },
      { code: 'MOCK002', name: 'Produk Contoh B', category: 'Umum', purchasePrice: 20000, sellingPrice: 25000, stock: 5 }
    ];
    return await request('getProducts');
  },
  async addProduct(data) {
    if (MOCK_MODE) return { success: true };
    return await request('addProduct', data, 'POST');
  },
  async editProduct(data) {
    if (MOCK_MODE) return { success: true };
    return await request('editProduct', data, 'POST');
  },
  async deleteProduct(code) {
    if (MOCK_MODE) return { success: true };
    return await request('deleteProduct', { code }, 'POST');
  },

  // CUSTOMERS
  async getCustomers() {
    if (MOCK_MODE) return [];
    return await request('getCustomers');
  },
  async addCustomer(data) {
    if (MOCK_MODE) return { success: true };
    return await request('addCustomer', data, 'POST');
  },
  async editCustomer(data) {
    if (MOCK_MODE) return { success: true };
    return await request('editCustomer', data, 'POST');
  },
  async deleteCustomer(phone) {
    if (MOCK_MODE) return { success: true };
    return await request('deleteCustomer', { phone }, 'POST');
  },

  // TRANSACTIONS
  async getTransactions() {
    if (MOCK_MODE) return [
      { date: new Date().toISOString(), type: 'Penjualan', receiptNo: 'TRX-1234', customerName: 'Budi', subtotal: 150000, items: '[{"name": "Produk A", "qty": 2, "sellingPrice": 75000}]' },
      { date: new Date(Date.now() - 86400000).toISOString(), type: 'Pembelian', receiptNo: 'TRX-1235', supplierName: 'Supplier X', subtotal: 500000, items: '[]' }
    ];
    return await request('getTransactions');
  },
  async saveTransaction(transactionData) {
    if (MOCK_MODE) return { success: true };
    return await request('saveTransaction', transactionData, 'POST');
  },

  // QUOTATIONS
  async getQuotations() {
    if (MOCK_MODE) return [];
    return await request('getQuotations');
  },
  async saveQuotation(quotationData) {
    if (MOCK_MODE) return { success: true };
    return await request('saveQuotation', quotationData, 'POST');
  },

  // SUPPLIERS
  async getSuppliers() {
    if (MOCK_MODE) return [];
    return await request('getSuppliers');
  },
  async addSupplier(data) {
    if (MOCK_MODE) return { success: true };
    return await request('addSupplier', data, 'POST');
  },
  async editSupplier(data) {
    if (MOCK_MODE) return { success: true };
    return await request('editSupplier', data, 'POST');
  },
  async deleteSupplier(phone) {
    if (MOCK_MODE) return { success: true };
    return await request('deleteSupplier', { phone }, 'POST');
  }
};
