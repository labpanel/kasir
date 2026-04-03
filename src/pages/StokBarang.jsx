import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const StokBarang = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    code: '', name: '', category: '', purchasePrice: '', sellingPrice: '', stock: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setFormData(prod);
      setIsEditing(true);
    } else {
      setFormData({ code: '', name: '', category: '', purchasePrice: '', sellingPrice: '', stock: '' });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock)
    };
    if (isEditing) {
      await api.editProduct(payload);
    } else {
      await api.addProduct(payload);
    }
    await fetchProducts();
    setModalOpen(false);
  };

  const handleDelete = async (code) => {
    if (confirm('Yakin ingin menghapus barang ini?')) {
      setLoading(true);
      await api.deleteProduct(code);
      await fetchProducts();
    }
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Barang</h1>
          <p className="text-gray-500 text-sm">Kelola produk dan persediaan stok gudang.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition">
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kode, nama atau kategori..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-4 font-medium">Kode</th>
                <th className="px-5 py-4 font-medium">Nama Barang</th>
                <th className="px-5 py-4 font-medium">Kategori</th>
                <th className="px-5 py-4 font-medium">Harga Beli</th>
                <th className="px-5 py-4 font-medium">Harga Jual</th>
                <th className="px-5 py-4 font-medium">Stok</th>
                <th className="px-5 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && products.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-gray-400">Produk tidak ditemukan.</td></tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.code} className="hover:bg-blue-50/50 transition-colors text-sm">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{prod.code}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{prod.name}</td>
                    <td className="px-5 py-3 text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{prod.category}</span></td>
                    <td className="px-5 py-3 text-gray-500">{formatIDR(prod.purchasePrice)}</td>
                    <td className="px-5 py-3 font-semibold text-blue-700">{formatIDR(prod.sellingPrice)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded font-bold text-xs ${prod.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.stock} Pcs
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleOpenModal(prod)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prod.code)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Barang' : 'Tambah Barang'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                  <input type="text" required disabled={isEditing} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <input type="text" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input type="text" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
                  <input type="number" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
                  <input type="number" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                <input type="number" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-5">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokBarang;
