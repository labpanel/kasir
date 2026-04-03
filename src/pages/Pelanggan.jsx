import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const Pelanggan = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: '', name: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setFormData(customer);
      setIsEditing(true);
    } else {
      setFormData({ phone: '', name: '', address: '' });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing) {
      await api.editCustomer(formData);
    } else {
      await api.addCustomer(formData);
    }
    await fetchCustomers();
    setModalOpen(false);
  };

  const handleDelete = async (phone) => {
    if (confirm('Yakin ingin menghapus pelanggan ini?')) {
      setLoading(true);
      await api.deleteCustomer(phone);
      await fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
          <p className="text-gray-500 text-sm">Kelola daftar kontak pelanggan Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Tambah Pelanggan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau No. Telepon..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">No. Telepon / ID</th>
                <th className="px-6 py-4 font-medium">Nama Pelanggan</th>
                <th className="px-6 py-4 font-medium">Alamat</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">Belum ada pelanggan.</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.phone} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{c.phone}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{c.address}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(c)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.phone)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon / ID Utama</label>
                <input 
                  type="text" 
                  required
                  disabled={isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                {!isEditing && <p className="text-xs text-gray-500 mt-1">Gunakan No HP sebagai ID unik.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
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

export default Pelanggan;
