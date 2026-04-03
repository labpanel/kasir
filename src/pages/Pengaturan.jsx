import { useState } from 'react';
import useStore from '../store/useStore';
import { Save } from 'lucide-react';

const InputGroup = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const Pengaturan = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-500 text-sm">Kelola profil toko dan preferensi aplikasi kasir.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition"
        >
          <Save className="w-4 h-4" /> Simpan Pengaturan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Detail Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Profil Toko</h2>
          
          <InputGroup 
            label="Nama Toko" 
            value={formData.storeName} 
            onChange={(e) => handleChange('storeName', e.target.value)} 
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Toko</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
              rows={3}
              value={formData.storeAddress}
              onChange={(e) => handleChange('storeAddress', e.target.value)}
            />
          </div>
          <InputGroup 
            label="Nomor Telepon" 
            value={formData.storePhone} 
            onChange={(e) => handleChange('storePhone', e.target.value)} 
          />
          <InputGroup 
            label="Logo URL" 
            placeholder="https://..."
            value={formData.logoUrl || ''} 
            onChange={(e) => handleChange('logoUrl', e.target.value)} 
          />
        </div>

        {/* Local Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Preferensi Aplikasi</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Printer Thermal</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-white"
              value={formData.thermalPrinter}
              onChange={(e) => handleChange('thermalPrinter', e.target.value)}
            >
              <option value="58mm">Kertas 58mm</option>
              <option value="80mm">Kertas 80mm</option>
              <option value="A4">A4 (Standard)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-white"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              <option value="Rp">Rupiah (Rp)</option>
              <option value="$">US Dollar ($)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Format Tanggal</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={formData.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <option value="light">Mode Terang</option>
                <option value="dark">Mode Gelap</option>
              </select>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
