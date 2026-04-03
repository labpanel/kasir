import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import useStore from '../store/useStore';
import { Search, Plus, Minus, Trash2, Printer, FileText } from 'lucide-react';

const Quotation = () => {
  const { settings } = useStore();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const printRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const [prods, custs] = await Promise.all([api.getProducts(), api.getCustomers()]);
      setProducts(prods || []);
      setCustomers(custs || []);
    };
    loadData();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(p => p.code === product.code);
      if (existing) return prev.map(p => p.code === product.code ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (code, qty) => {
    setCart(prev => prev.map(p => p.code === code ? { ...p, qty } : p));
  };

  const removeFromCart = (code) => {
    setCart(prev => prev.filter(p => p.code !== code));
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.qty), 0);
  const quotationNo = `QT-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;

  const handleSave = async () => {
    if (cart.length === 0 || !selectedCustomer) {
      alert('Keranjang kosong atau pelanggan belum dipilih!');
      return;
    }
    setLoading(true);
    try {
      await api.saveQuotation({
        date: new Date().toISOString(),
        quoNo: quotationNo,
        customerId: selectedCustomer,
        items: cart,
        total: subtotal
      });
      alert('Quotation berhasil disimpan!');
    } catch (e) {
      alert('Gagal menyimpan quotation.');
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const custObj = customers.find(c => c.phone === selectedCustomer) || {};

  return (
    <div className="flex flex-col gap-6 h-full print:bg-white print:m-0 print:p-0">
      
      {/* HEADER SECTION (HIDDEN ON PRINT) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Quotation</h1>
          <p className="text-gray-500 text-sm">Penawaran harga untuk pelanggan.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow font-bold hover:bg-indigo-700 transition">
            {loading ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white rounded-xl shadow font-bold hover:bg-gray-900 flex items-center gap-2">
            <Printer className="w-4 h-4" /> Cetak PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] print:h-auto print:block">
        
        {/* PRODUCT SELECTOR (HIDDEN ON PRINT) */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari barang..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            {filteredProducts.map(p => (
              <div key={p.code} onClick={() => addToCart(p)} className="p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.code}</p>
                </div>
                <span className="font-bold text-blue-600 text-sm">{formatIDR(p.sellingPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRINTABLE QUOTATION SHEET */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-y-auto print:shadow-none print:border-none print:p-0 print:w-full">
          <div ref={printRef} className="max-w-3xl mx-auto">
            {/* Header Surat */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">QUOTATION</h2>
                <p className="text-gray-500 mt-1">No: {quotationNo}</p>
                <p className="text-gray-500">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold text-gray-800">{settings.storeName}</h3>
                <p className="text-sm text-gray-600 w-48 ml-auto mt-1">{settings.storeAddress}</p>
                <p className="text-sm text-gray-600">Tel: {settings.storePhone}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 print:bg-transparent print:p-0 print:border-none">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 print:hidden">Ditujukan Kepada:</h4>
              <div className="print:hidden mb-3">
                <select className="w-full max-w-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                  <option value="">-- Pilih Data Pelanggan --</option>
                  {customers.map(c => <option key={c.phone} value={c.phone}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="text-gray-800">
                <p className="font-bold text-lg">{custObj.name || '[Nama Pelanggan]'}</p>
                <p>{custObj.address || '[Alamat Pelanggan]'}</p>
                <p>{custObj.phone || '[No Telepon]'}</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left mb-8 border-collapse">
              <thead>
                <tr className="border-y-2 border-gray-800 text-gray-900">
                  <th className="py-3 font-bold">Produk / Deskripsi</th>
                  <th className="py-3 font-bold text-center">Qty</th>
                  <th className="py-3 font-bold text-right">Harga Satuan</th>
                  <th className="py-3 font-bold text-right">Total</th>
                  <th className="py-3 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.length === 0 ? (
                  <tr><td colSpan="5" className="py-10 text-center text-gray-400">Pilih barang untuk dimasukkan ke penawaran.</td></tr>
                ) : (
                  cart.map(item => (
                    <tr key={item.code} className="text-gray-800">
                      <td className="py-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2 print:hidden">
                          <button onClick={() => item.qty > 1 ? updateQty(item.code, item.qty - 1) : removeFromCart(item.code)} className="px-2 bg-gray-100 rounded text-gray-600 hover:bg-red-100"><Minus className="w-3 h-3" /></button>
                          <span className="w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.code, item.qty + 1)} className="px-2 bg-gray-100 rounded text-gray-600 hover:bg-blue-100"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="hidden print:inline">{item.qty}</span>
                      </td>
                      <td className="py-4 text-right">{formatIDR(item.sellingPrice)}</td>
                      <td className="py-4 text-right font-medium">{formatIDR(item.sellingPrice * item.qty)}</td>
                      <td className="py-4 text-right print:hidden">
                        <button onClick={() => removeFromCart(item.code)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="flex justify-end mb-16">
              <div className="w-64">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 text-gray-600 mt-2">
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-3 text-xl font-bold text-gray-900 border-b-2 border-gray-900">
                  <span>TOTAL</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="text-sm text-gray-500">
              <p className="font-bold text-gray-700 mb-1">Catatan Tambahan:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Harga dapat berubah sewaktu-waktu.</li>
                <li>Penawaran ini berlaku selama 14 hari sejak tanggal diterbitkan.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
