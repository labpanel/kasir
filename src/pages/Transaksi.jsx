import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useStore from '../store/useStore';
import { api } from '../services/api';
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Package, X, Banknote, CreditCard, QrCode, FileText, Receipt } from 'lucide-react';

// =============================================
// RECEIPT TEMPLATES
// =============================================

const ReceiptThermal = ({ data, settings, formatIDR }) => {
  const is80 = settings.thermalPrinter === '80mm';
  const w = is80 ? '80mm' : '58mm';
  const fs = is80 ? '12px' : '10px';
  const fsSmall = is80 ? '10px' : '8px';
  const fsBold = is80 ? '14px' : '11px';
  const dash = is80 ? '------------------------------------------------' : '--------------------------------';
  const compact = (val) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);

  return (
    <div className="print-template" style={{ fontFamily: "'Courier New', Courier, monospace", width: w, maxWidth: w, margin: '0 auto', padding: '4px 6px', color: '#000', backgroundColor: '#fff', fontSize: fs, lineHeight: '1.4' }}>
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <p style={{ fontSize: fsBold, fontWeight: '700', margin: 0 }}>{settings.storeName}</p>
        <p style={{ fontSize: fsSmall, margin: 0 }}>{settings.storeAddress}</p>
        <p style={{ fontSize: fsSmall, margin: '0 0 2px 0' }}>Tel: {settings.storePhone}</p>
      </div>
      <p style={{ margin: 0 }}>{dash}</p>
      <p style={{ textAlign: 'center', fontWeight: '700', fontSize: fsBold, margin: '2px 0' }}>NOTA {data.type?.toUpperCase()}</p>
      <p style={{ margin: 0 }}>{dash}</p>
      <div style={{ margin: '2px 0', fontSize: fsSmall }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>No:</span><span>{data.receiptNo}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tgl:</span><span>{new Date(data.date).toLocaleString('id-ID')}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bayar:</span><span>{data.paymentMethod}</span></div>
        {data.customerName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Plg:</span><span>{data.customerName}</span></div>}
      </div>
      <p style={{ margin: 0 }}>{dash}</p>
      {data.items.map((item, idx) => (
        <div key={idx} style={{ margin: '3px 0' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fsSmall }}>
            <span>{item.qty} x {compact(item.price)}</span>
            <span style={{ fontWeight: '600' }}>{compact(item.price * item.qty)}</span>
          </div>
        </div>
      ))}
      <p style={{ margin: '3px 0 0 0' }}>{dash}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: fsBold, margin: '3px 0' }}>
        <span>TOTAL</span><span>{formatIDR(data.subtotal)}</span>
      </div>
      {data.paymentMethod === 'Cash' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, margin: '1px 0' }}>
            <span>Dibayar</span><span>{formatIDR(data.payAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs, fontWeight: '700', margin: '1px 0' }}>
            <span>Kembali</span><span>{formatIDR(data.change)}</span>
          </div>
        </>
      )}
      <p style={{ margin: '3px 0 0 0' }}>{dash}</p>
      <p style={{ textAlign: 'center', fontSize: fsSmall, margin: '4px 0' }}>Terima kasih atas kunjungan Anda</p>
      <p style={{ textAlign: 'center', fontSize: fsSmall, margin: '0 0 4px 0' }}>Barang yang sudah dibeli tidak dapat dikembalikan</p>
    </div>
  );
};

const ReceiptA4 = ({ data, settings, formatIDR }) => (
  <div className="print-template" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", maxWidth: '800px', margin: '0 auto', padding: '24px', color: '#1e293b' }}>
    {/* Header */}
    <div style={{ borderBottom: '3px solid #1e40af', paddingBottom: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#1e40af', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
              {settings.storeName?.charAt(0) || 'K'}
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>{settings.storeName}</h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{settings.storeAddress} | Tel: {settings.storePhone}</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e40af', margin: 0, letterSpacing: '2px' }}>INVOICE</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Nota {data.type}</p>
        </div>
      </div>
    </div>

    {/* Meta */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', gap: '24px' }}>
      <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Pelanggan</h4>
        <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 2px 0' }}>{data.customerName || 'Umum'}</p>
      </div>
      <div style={{ width: '220px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>No. Nota</p>
          <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{data.receiptNo}</p>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Tanggal</p>
          <p style={{ fontSize: '13px', margin: 0 }}>{new Date(data.date).toLocaleString('id-ID')}</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Pembayaran</p>
          <p style={{ fontSize: '13px', margin: 0, fontWeight: '600' }}>{data.paymentMethod}</p>
        </div>
      </div>
    </div>

    {/* Table */}
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
      <thead>
        <tr style={{ backgroundColor: '#1e40af' }}>
          {['No', 'Produk', 'Qty', 'Harga Satuan', 'Total'].map((h, i) => (
            <th key={i} style={{ padding: '12px 16px', color: 'white', fontSize: '12px', fontWeight: '700', textAlign: i === 2 ? 'center' : i > 2 ? 'right' : 'left', textTransform: 'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{idx + 1}</td>
            <td style={{ padding: '12px 16px' }}>
              <p style={{ fontWeight: '600', fontSize: '14px', margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Kode: {item.code}</p>
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>{item.qty}</td>
            <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>{formatIDR(item.price)}</td>
            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700' }}>{formatIDR(item.price * item.qty)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Summary */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
      <div style={{ width: '280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
          <span>Subtotal</span><span>{formatIDR(data.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#1e40af', borderRadius: '8px', marginTop: '8px' }}>
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>TOTAL</span>
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>{formatIDR(data.subtotal)}</span>
        </div>
        {data.paymentMethod === 'Cash' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#475569' }}>
              <span>Dibayar</span><span>{formatIDR(data.payAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', fontWeight: '700', color: '#16a34a', borderTop: '1px dashed #e2e8f0' }}>
              <span>Kembalian</span><span>{formatIDR(data.change)}</span>
            </div>
          </>
        )}
      </div>
    </div>

    <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
      <p style={{ margin: 0 }}>Terima kasih atas kunjungan Anda • Barang yang sudah dibeli tidak dapat dikembalikan</p>
    </div>
  </div>
);

// =============================================
// PAYMENT METHOD OPTIONS
// =============================================
const PAYMENT_METHODS = [
  { id: 'Cash', label: 'Cash', icon: Banknote, color: 'green' },
  { id: 'Transfer', label: 'Transfer', icon: CreditCard, color: 'blue' },
  { id: 'QRIS', label: 'QRIS', icon: QrCode, color: 'purple' },
];

// =============================================
// MAIN COMPONENT
// =============================================
const Transaksi = () => {
  const { cart, addToCart, updateCartItemQty, removeFromCart, clearCart, settings } = useStore();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [searchCode, setSearchCode] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [transactionType, setTransactionType] = useState('Penjualan');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptFormat, setReceiptFormat] = useState('thermal'); // 'thermal' or 'a4'

  useEffect(() => {
    const loadData = async () => {
      const [prods, custs] = await Promise.all([api.getProducts(), api.getCustomers()]);
      setProducts(prods || []);
      setCustomers(custs || []);
    };
    loadData();
  }, []);

  const handleScanCode = (e) => {
    e.preventDefault();
    const product = products.find(p => p.code.toLowerCase() === searchCode.toLowerCase());
    if (product) { addToCart(product); setSearchCode(''); }
    else { alert('Produk tidak ditemukan!'); }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const calculatePrice = (item) => transactionType === 'Penjualan' ? item.sellingPrice : item.purchasePrice;
  const subtotal = cart.reduce((sum, item) => sum + (calculatePrice(item) * item.qty), 0);
  const change = Math.max(0, Number(payAmount || 0) - subtotal);

  const generateReceiptNo = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
  };

  const handleProcessTransaction = async () => {
    if (cart.length === 0) return;
    // Cash needs sufficient payment, Transfer/QRIS auto-fill exact amount
    if (paymentMethod === 'Cash' && Number(payAmount) < subtotal) {
      alert('Uang pembayaran kurang!');
      return;
    }
    setLoading(true);
    try {
      const custObj = customers.find(c => c.phone === selectedCustomer);
      const actualPayAmount = paymentMethod === 'Cash' ? Number(payAmount) : subtotal;
      const actualChange = paymentMethod === 'Cash' ? Math.max(0, actualPayAmount - subtotal) : 0;

      const data = {
        date: new Date().toISOString(),
        type: transactionType,
        paymentMethod,
        customerId: selectedCustomer,
        customerName: custObj?.name || '',
        receiptNo: generateReceiptNo(),
        items: cart.map(item => ({
          code: item.code,
          name: item.name,
          qty: item.qty,
          price: calculatePrice(item)
        })),
        subtotal,
        payAmount: actualPayAmount,
        change: actualChange
      };
      await api.saveTransaction(data);
      
      // Store receipt data and show print dialog
      setReceiptData(data);
      setShowReceipt(true);
      
      clearCart();
      setPayAmount('');
      setSelectedCustomer('');
    } catch (err) {
      alert('Gagal memproses transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    setTimeout(() => { window.print(); }, 200);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  const canProcess = paymentMethod === 'Cash' 
    ? cart.length > 0 && Number(payAmount) >= subtotal 
    : cart.length > 0;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-[calc(100vh-7rem)] print:hidden">
        {/* Product List Panel */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 md:p-4 border-b border-gray-100 space-y-3">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button 
                onClick={() => setTransactionType('Penjualan')}
                className={`px-3 md:px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Penjualan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Penjualan
              </button>
              <button 
                onClick={() => setTransactionType('Pembelian')}
                className={`px-3 md:px-4 py-2 text-sm font-bold rounded-md transition ${transactionType === 'Pembelian' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pembelian
              </button>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-3 md:p-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.code} 
                  onClick={() => addToCart(prod)}
                  className="border border-gray-100 rounded-xl p-3 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-full mb-2 flex items-center justify-center text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-xs line-clamp-2 mb-1">{prod.name}</h4>
                  <p className="text-gray-500 text-xs mb-1">Stok: {prod.stock}</p>
                  <p className="text-blue-600 font-bold text-xs mt-auto">
                    {formatIDR(transactionType === 'Penjualan' ? prod.sellingPrice : prod.purchasePrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart & Payment Panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-3">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pelanggan</label>
            <select 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">-- Opsional --</option>
              {customers.map(c => (
                <option key={c.phone} value={c.phone}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>

          {/* Cart */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <form onSubmit={handleScanCode} className="flex gap-2">
                <input type="text" placeholder="Scan kode..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
                <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Tambah</button>
              </form>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ShoppingCart className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">Keranjang Kosong</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = calculatePrice(item);
                  return (
                    <div key={item.code} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-gray-800 truncate">{item.name}</h5>
                        <p className="text-xs text-gray-500">{formatIDR(itemPrice)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => item.qty > 1 ? updateCartItemQty(item.code, item.qty - 1) : removeFromCart(item.code)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateCartItemQty(item.code, item.qty + 1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600">
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

            {/* Payment Section */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-3">
              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-b border-dashed border-gray-300 pb-2">
                <span>Total</span>
                <span className="text-blue-600">{formatIDR(subtotal)}</span>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">METODE PEMBAYARAN</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    const isActive = paymentMethod === m.id;
                    const colors = {
                      green: isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                      blue: isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                      purple: isActive ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                    };
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition font-bold text-xs ${colors[m.color]}`}
                      >
                        <Icon className="w-5 h-5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cash Input */}
              {paymentMethod === 'Cash' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">DIBAYAR</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none text-right"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between text-gray-700 bg-green-50 p-3 rounded-xl border border-green-100">
                    <span className="font-medium text-sm">Kembalian</span>
                    <span className="font-bold text-lg text-green-700">{formatIDR(change)}</span>
                  </div>
                </div>
              )}

              {/* Transfer / QRIS Info */}
              {paymentMethod === 'Transfer' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <CreditCard className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                  <p className="text-sm font-bold text-blue-800">Transfer Bank</p>
                  <p className="text-xs text-blue-600">Pastikan pembayaran sudah diterima</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">{formatIDR(subtotal)}</p>
                </div>
              )}
              {paymentMethod === 'QRIS' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                  <QrCode className="w-8 h-8 mx-auto text-purple-500 mb-1" />
                  <p className="text-sm font-bold text-purple-800">QRIS</p>
                  <p className="text-xs text-purple-600">Scan QR atau pastikan pembayaran diterima</p>
                  <p className="text-lg font-bold text-purple-900 mt-1">{formatIDR(subtotal)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button 
                  onClick={clearCart}
                  className="py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl flex items-center justify-center gap-2 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Batal
                </button>
                <button 
                  disabled={loading || !canProcess}
                  onClick={handleProcessTransaction}
                  className="py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition text-sm"
                >
                  <Printer className="w-4 h-4" /> Proses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* RECEIPT MODAL (after successful transaction) */}
      {/* ============================================= */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">✅ Transaksi Berhasil!</h2>
                <p className="text-sm text-gray-500">{receiptData.receiptNo}</p>
              </div>
              <button onClick={handleCloseReceipt} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            {/* Summary */}
            <div className="p-5 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 font-medium">Total Pembayaran</p>
                <p className="text-3xl font-bold text-green-800">{formatIDR(receiptData.subtotal)}</p>
                <p className="text-xs text-green-600 mt-1">via {receiptData.paymentMethod}</p>
                {receiptData.paymentMethod === 'Cash' && receiptData.change > 0 && (
                  <p className="text-sm text-green-700 mt-2 font-bold">Kembalian: {formatIDR(receiptData.change)}</p>
                )}
              </div>

              {/* Print Format Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cetak Nota:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setReceiptFormat('thermal')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${receiptFormat === 'thermal' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Receipt className="w-8 h-8 text-amber-600" />
                    <div className="text-center">
                      <p className="font-bold text-sm text-gray-800">Thermal</p>
                      <p className="text-xs text-gray-500">Struk {settings.thermalPrinter || '58mm'}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setReceiptFormat('a4')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${receiptFormat === 'a4' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="text-center">
                      <p className="font-bold text-sm text-gray-800">A4 / PDF</p>
                      <p className="text-xs text-gray-500">Kertas A4 standar</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={handleCloseReceipt} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition text-sm">
                Lewati
              </button>
              <button onClick={handlePrintReceipt} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-md">
                <Printer className="w-4 h-4" /> Cetak Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY VIEW (portal to body) */}
      {receiptData && createPortal(
        <div id="print-area" className="hidden print:block">
          {receiptFormat === 'thermal' 
            ? <ReceiptThermal data={receiptData} settings={settings} formatIDR={formatIDR} />
            : <ReceiptA4 data={receiptData} settings={settings} formatIDR={formatIDR} />
          }
        </div>,
        document.body
      )}
    </>
  );
};

export default Transaksi;
