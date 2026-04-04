import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Search, X, Truck } from 'lucide-react';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: '', name: '', company: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await api.getSuppliers();
      setSuppliers(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleOpenModal = (sup = null) => {
    if (sup) { setFormData(sup); setIsEditing(true); }
    else { setFormData({ phone: '', name: '', company: '', address: '' }); setIsEditing(false); }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing) { await api.editSupplier(formData); }
    else { await api.addSupplier(formData); }
    await fetchSuppliers();
    setModalOpen(false);
  };

  const handleDelete = async (phone) => {
    if (confirm('Yakin ingin menghapus supplier ini?')) {
      setLoading(true);
      await api.deleteSupplier(phone);
      await fetchSuppliers();
    }
  };

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Supplier</h1>
          <p className="text-gray-500 text-sm">Kelola daftar pemasok barang Anda.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition">
          <Plus className="w-4 h-4" /> Tambah Supplier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari nama, perusahaan, atau telepon..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-4 font-medium">Telepon</th>
                <th className="px-5 py-4 font-medium">Nama</th>
                <th className="px-5 py-4 font-medium hidden md:table-cell">Perusahaan</th>
                <th className="px-5 py-4 font-medium hidden sm:table-cell">Alamat</th>
                <th className="px-5 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && suppliers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-400">
                  <Truck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  Belum ada supplier.
                </td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.phone} className="hover:bg-blue-50/50 transition-colors text-sm">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{s.phone}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">
                      {s.company && <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{s.company}</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm max-w-xs truncate hidden sm:table-cell">{s.address}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.phone)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon (ID)</label>
                <input type="text" required disabled={isEditing} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                {!isEditing && <p className="text-xs text-gray-500 mt-1">Gunakan No HP sebagai ID unik supplier.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kontak</label>
                <input type="text" required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                <input type="text" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Opsional" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea rows={2} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition text-sm">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
