const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwb-QvZTDrQpKMi5wbHqVwVUrviwER2CqyZ7YqiUzqwWhjdJ_trBzLtoB44erNiO6IZgg/exec';

// Set to true for local-only authentication and data management
const MOCK_MODE = false;

import useStore from '../store/useStore';

const request = async (action, data = null, method = 'GET') => {
  const setApiError = useStore.getState().setApiError;
  console.log(`[API Request] ${action}`, data);
  try {
    let url = SCRIPT_URL;
    let options = { method };

    if (method === 'GET') {
      url += `?action=${action}`;
      if (data) {
        Object.keys(data).forEach(key => {
          url += `&${key}=${encodeURIComponent(data[key])}`;
        });
      }
    } else {
      // Use text/plain to avoid CORS preflight (OPTIONS request) which GAS doPost doesn't handle well
      options.body = JSON.stringify({ action, data });
      options.headers = { 'Content-Type': 'text/plain' };
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const result = await res.json();
    console.log(`[API Response] ${action}`, result);
    setApiError(null); // Clear error on success
    return result;
  } catch (err) {
    console.error(`[API Error] ${action}`, err);
    if (err.message.includes('fetch')) {
      setApiError('Gagal terhubung ke Google Sheets. Pastikan Deployment Apps Script sudah "Anyone".');
    }
    throw err;
  }
};

export const api = {
  async verifyLogin(email, password) {
    if (MOCK_MODE) {
      if (email === 'admin@gmail.com' && password === '1234') {
        return { success: true, user: { email, role: 'Admin', name: 'Administrator' } };
      }
      return { success: false, error: 'Email atau password salah' };
    }
    return await request('verifyLogin', { email, password }, 'POST');
  },
  async registerUser(email, password, name) {
    if (MOCK_MODE) return { success: true };
    return await request('registerUser', { email, password, name }, 'POST');
  },
  async resetPassword(email, newPassword) {
    if (MOCK_MODE) return { success: true };
    return await request('resetPassword', { email, newPassword }, 'POST');
  },

  // PRODUCTS
  async getProducts() {
    if (MOCK_MODE) return [];
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
    if (MOCK_MODE) return [];
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
  async updateQuotationStatus(quoNo, status) {
    if (MOCK_MODE) return { success: true };
    return await request('updateQuotationStatus', { quoNo, status }, 'POST');
  },
  async getQuotationPdfLink(data) {
    if (MOCK_MODE) return { success: true, url: '#' };
    return await request('getQuotationPdfLink', data, 'POST');
  },
  async getTransactionPdfLink(data) {
    if (MOCK_MODE) return { success: true, url: '#' };
    return await request('getTransactionPdfLink', data, 'POST');
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

export default api;
