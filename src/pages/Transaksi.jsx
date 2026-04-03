import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { api } from '../services/api';
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Package } from 'lucide-react';

const Transaksi = () => {
  const { cart, addToCart, updateCartItemQty, removeFromCart, clearCart } = useStore();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [searchCode, setSearchCode] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [transactionType, setTransactionType] = useState('Penjualan');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [prods, custs] = await Promise.all([
        api.getProducts(),
        api.getCustomers()
      ]);
      setProducts(prods || []);
      setCustomers(custs || []);
    };
    loadData();
  }, []);

  const handleScanCode = (e) => {
    e.preventDefault();
    const product = products.find(p => p.code.toLowerCase() === searchCode.toLowerCase());
    if (product) {
      addToCart(product);
      setSearchCode('');
    } else {
      alert('Produk tidak ditemukan!');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Use Selling Price if Penjualan, Purchase Price if Pembelian
  const calculatePrice = (item) => transactionType === 'Penjualan' ? item.sellingPrice : item.purchasePrice;

  const subtotal = cart.reduce((sum, item) => sum + (calculatePrice(item) * item.qty), 0);
  const change = Math.max(0, Number(payAmount || 0) - subtotal);

  const handleProcessTransaction = async () => {
    if (cart.length === 0) return;
    if (Number(payAmount) < subtotal) {
      alert('Uang pembayaran kurang!');
      return;
    }
    setLoading(true);
    try {
      const data = {
        date: new Date().toISOString(),
        type: transactionType,
        customerId: selectedCustomer,
        items: cart.map(item => ({
          code: item.code,
          name: item.name,
          qty: item.qty,
          price: calculatePrice(item)
        })),
        subtotal,
        payAmount: Number(payAmount),
        change
      };
      await api.saveTransaction(data);
      alert('Transaksi Berhasil Disimpan!');
      clearCart();
      setPayAmount('');
      setSelectedCustomer('');
    } catch (err) {
      alert('Gagal memproses transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Product List Panel */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            <button 
              onClick={() => setTransactionType('Penjualan')}
              className={`px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Penjualan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Penjualan
            </button>
            <button 
              onClick={() => setTransactionType('Pembelian')}
              className={`px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Pembelian' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pembelian (Stok Masuk)
            </button>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama produk, kategori, atau kode..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(prod => (
              <div 
                key={prod.code} 
                onClick={() => addToCart(prod)}
                className="border border-gray-100 rounded-xl p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full mb-3 flex items-center justify-center text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{prod.name}</h4>
                <p className="text-gray-500 text-xs mb-2">Stok: {prod.stock}</p>
                <p className="text-blue-600 font-bold text-sm mt-auto">
                  {formatIDR(transactionType === 'Penjualan' ? prod.sellingPrice : prod.purchasePrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Payment Panel */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        {/* Customer Select */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pelanggan / Pemasok</label>
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- Pilih Pelanggan (Opsional) --</option>
            {customers.map(c => (
              <option key={c.phone} value={c.phone}>{c.name} ({c.phone})</option>
            ))}
          </select>
        </div>

        {/* Cart Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <form onSubmit={handleScanCode} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Scan / Ketik Kode..." 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Tambah
              </button>
            </form>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Keranjang Kosong</p>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = calculatePrice(item);
                return (
                  <div key={item.code} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-800 line-clamp-1">{item.name}</h5>
                      <p className="text-xs text-gray-500">{formatIDR(itemPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => item.qty > 1 ? updateCartItemQty(item.code, item.qty - 1) : removeFromCart(item.code)}
                        className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                      <button 
                        onClick={() => updateCartItemQty(item.code, item.qty + 1)}
                        className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right w-20 font-bold text-sm text-gray-800">
                      {formatIDR(itemPrice * item.qty)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 border-b border-dashed border-gray-300 pb-2">
                <span>Total Tagihan</span>
                <span className="text-blue-600">{formatIDR(subtotal)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">DIBAYAR (CASH)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="flex justify-between text-gray-700 bg-green-50 p-3 rounded-xl border border-green-100">
                <span className="font-medium">Kembalian</span>
                <span className="font-bold text-lg text-green-700">{formatIDR(change)}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button 
                onClick={clearCart}
                className="py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" /> Batal
              </button>
              <button 
                disabled={loading || cart.length === 0 || Number(payAmount) < subtotal}
                onClick={handleProcessTransaction}
                className="py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
              >
                <Printer className="w-4 h-4" /> Proses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaksi;
