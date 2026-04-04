import { useState, useRef } from 'react';
import useStore from '../store/useStore';
import { api } from '../services/api';
import { Save, RotateCcw, Trash2, AlertTriangle, Download, Upload, Shield, ShoppingCart, Package, Users, FileText, BarChart2, Settings, LayoutDashboard, Truck, Printer } from 'lucide-react';
import { createPortal } from 'react-dom';

// Default values
const DEFAULT_SETTINGS = {
  storeName: 'Toko Saya', storeAddress: 'Jl. Merdeka No. 123', storePhone: '081234567890',
  storeEmail: 'info@tokosaya.com', storeWebsite: 'www.tokosaya.com',
  currency: 'Rp', dateFormat: 'DD/MM/YYYY', theme: 'light', thermalPrinter: '58mm',
  receiptFooter: 'Terima kasih atas kunjungan Anda', autoThermalMobile: true,
};
const DEFAULT_QUOTATION = {
  template: 'professional', thermalPaperWidth: '58mm', validityDays: 14,
  terms: ['Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.', 'Penawaran ini berlaku selama 14 hari sejak tanggal diterbitkan.', 'Pembayaran dilakukan sesuai kesepakatan bersama.'],
  signatureLeft: 'Pelanggan',  signatureRight: 'Hormat Kami', signatureLeftImage: '', signatureRightImage: '',
  showLogo: true, headerTitle: 'QUOTATION', headerSubtitle: 'Penawaran Harga', showStoreAddress: true, showStorePhone: true, showStoreEmail: false, showStoreWebsite: false, accentColor: '#1e40af', footerText: '',
};

// All permission keys with labels and icons
const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transaksi', label: 'Transaksi', icon: ShoppingCart },
  { key: 'stok', label: 'Stok Barang', icon: Package },
  { key: 'pelanggan', label: 'Pelanggan', icon: Users },
  { key: 'supplier', label: 'Supplier', icon: Truck },
  { key: 'quotation', label: 'Quotation', icon: FileText },
  { key: 'laporan', label: 'Laporan', icon: BarChart2 },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

const InputGroup = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" value={value} onChange={onChange} placeholder={placeholder} />
  </div>
);

const Pengaturan = () => {
  const { settings, updateSettings, updateQuotationSettings, logout, user, rolePermissions, updateRolePermissions } = useStore();
  const [formData, setFormData] = useState(settings);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showTestPrint, setShowTestPrint] = useState(false);
  const fileInputRef = useRef(null);

  const isAdmin = user?.role === 'Admin';
  const userPerms = rolePermissions?.userPermissions || [];

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSave = () => { updateSettings(formData); alert('Pengaturan berhasil disimpan!'); };

  // --- EXPORT ---
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const [products, customers, transactions, quotations] = await Promise.all([
        api.getProducts(), api.getCustomers(), api.getTransactions(), api.getQuotations()
      ]);
      const exportData = {
        exportDate: new Date().toISOString(),
        appName: 'Kasir App',
        settings,
        products: products || [],
        customers: customers || [],
        transactions: transactions || [],
        quotations: quotations || [],
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kasir-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('✅ Data berhasil diekspor!');
    } catch (err) {
      alert('Gagal mengekspor data: ' + err.message);
    }
    setExportLoading(false);
  };

  // --- IMPORT ---
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.products && !data.customers) {
        alert('Format file tidak valid. Pastikan file berasal dari export Kasir App.');
        setImportLoading(false);
        return;
      }

      const confirm = window.confirm(
        `Import Data:\n\n` +
        `📦 Produk: ${data.products?.length || 0}\n` +
        `👤 Pelanggan: ${data.customers?.length || 0}\n\n` +
        `Data yang sama (kode/telepon sama) akan ditimpa.\nLanjutkan?`
      );

      if (!confirm) { setImportLoading(false); return; }

      let imported = { products: 0, customers: 0 };

      // Import products
      if (data.products?.length) {
        for (const prod of data.products) {
          try { await api.addProduct(prod); imported.products++; } catch {}
        }
      }
      // Import customers
      if (data.customers?.length) {
        for (const cust of data.customers) {
          try { await api.addCustomer(cust); imported.customers++; } catch {}
        }
      }
      // Import settings if present
      if (data.settings) {
        updateSettings(data.settings);
        setFormData(data.settings);
      }

      alert(`✅ Import selesai!\n\n📦 Produk: ${imported.products}\n👤 Pelanggan: ${imported.customers}`);
    } catch (err) {
      alert('Gagal mengimport: ' + err.message);
    }
    setImportLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- PERMISSION TOGGLE ---
  const togglePermission = (key) => {
    const current = [...userPerms];
    if (current.includes(key)) {
      updateRolePermissions({ userPermissions: current.filter(k => k !== key) });
    } else {
      updateRolePermissions({ userPermissions: [...current, key] });
    }
  };

  // --- TEST PRINT ---
  const handleTestPrint = () => {
    setShowTestPrint(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowTestPrint(false), 500);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-500 text-sm">Kelola profil toko dan preferensi aplikasi.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition">
          <Save className="w-4 h-4" /> Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Profil Toko</h2>
          <InputGroup label="Nama Toko" value={formData.storeName} onChange={(e) => handleChange('storeName', e.target.value)} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Toko</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" rows={3} value={formData.storeAddress} onChange={(e) => handleChange('storeAddress', e.target.value)} />
          </div>
          <InputGroup label="Nomor Telepon" value={formData.storePhone} onChange={(e) => handleChange('storePhone', e.target.value)} />
          <InputGroup label="Email / Informasi Lain" value={formData.storeEmail || ''} onChange={(e) => handleChange('storeEmail', e.target.value)} />
          <InputGroup label="Website / Instagram" value={formData.storeWebsite || ''} onChange={(e) => handleChange('storeWebsite', e.target.value)} />
          <InputGroup label="Logo URL" placeholder="https://..." value={formData.logoUrl || ''} onChange={(e) => handleChange('logoUrl', e.target.value)} />
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Preferensi Aplikasi</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm bg-white" value={formData.currency} onChange={(e) => handleChange('currency', e.target.value)}>
                <option value="Rp">Rupiah (Rp)</option>
                <option value="$">US Dollar ($)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Format Tanggal</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" value={formData.dateFormat} onChange={(e) => handleChange('dateFormat', e.target.value)}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" value={formData.theme} onChange={(e) => handleChange('theme', e.target.value)}>
                <option value="light">Mode Terang</option>
                <option value="dark">Mode Gelap</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Printer Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Printer className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-800">Pengaturan Printer</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Kertas Thermal</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" value={formData.thermalPrinter} onChange={(e) => handleChange('thermalPrinter', e.target.value)}>
              <option value="58mm">58mm (Mini Printer)</option>
              <option value="80mm">80mm (Standar Kasir)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Pilih sesuai lebar kertas printer thermal Anda.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Cetak di Mobile</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" value={formData.autoThermalMobile !== false ? 'thermal' : 'ask'} onChange={(e) => handleChange('autoThermalMobile', e.target.value === 'thermal')}>
              <option value="thermal">Otomatis Thermal</option>
              <option value="ask">Tanya Setiap Kali</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Saat mobile, langsung pakai format thermal.</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Footer Struk</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Terima kasih atas kunjungan Anda" value={formData.receiptFooter || ''} onChange={(e) => handleChange('receiptFooter', e.target.value)} />
          <p className="text-xs text-gray-400 mt-1">Teks yang tampil di bagian bawah struk.</p>
        </div>

        {/* Test Print */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-sm text-amber-800">🖨️ Test Print</p>
              <p className="text-xs text-amber-600">Cetak contoh struk untuk memastikan printer terhubung dan ukuran kertas sesuai.</p>
            </div>
            <button onClick={handleTestPrint} className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition flex items-center gap-2 whitespace-nowrap shadow-sm">
              <Printer className="w-4 h-4" /> Cetak Test
            </button>
          </div>
        </div>
      </div>

      {/* Import / Export */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Import & Export Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Download className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-blue-800">Export Data</h3>
                <p className="text-xs text-blue-600 mt-1 mb-3">Download semua data (produk, pelanggan, transaksi, quotation) sebagai file JSON backup.</p>
                <button onClick={handleExport} disabled={exportLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
                  <Download className="w-4 h-4" /> {exportLoading ? 'Mengunduh...' : 'Export JSON'}
                </button>
              </div>
            </div>
          </div>

          {/* Import */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-start gap-3">
              <Upload className="w-8 h-8 text-green-500 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-green-800">Import Data</h3>
                <p className="text-xs text-green-600 mt-1 mb-3">Upload file JSON backup untuk menambahkan produk dan pelanggan ke database.</p>
                <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition cursor-pointer ${importLoading ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  <Upload className="w-4 h-4" /> {importLoading ? 'Mengimport...' : 'Pilih File JSON'}
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} disabled={importLoading} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Permissions (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-3">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-indigo-700">Hak Akses (Role)</h2>
          </div>

          <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-800"><strong>Admin</strong> — Akses penuh ke semua fitur (tidak bisa diubah)</p>
            <p className="text-sm text-indigo-600 mt-1"><strong>User / Pegawai</strong> — Atur akses menu di bawah ini:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_PERMISSIONS.map(perm => {
              const Icon = perm.icon;
              const isEnabled = userPerms.includes(perm.key);
              return (
                <label key={perm.key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${isEnabled ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                  <input type="checkbox" checked={isEnabled} onChange={() => togglePermission(perm.key)} className="accent-indigo-600 w-4 h-4" />
                  <Icon className={`w-5 h-5 ${isEnabled ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-medium text-sm ${isEnabled ? 'text-indigo-800' : 'text-gray-500'}`}>{perm.label}</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">Perubahan langsung disimpan. User/Pegawai hanya melihat menu yang dicentang.</p>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-red-100 pb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-red-700">Zona Bahaya</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-bold text-sm text-gray-800">Reset Pengaturan Toko</p>
              <p className="text-xs text-gray-500">Kembalikan nama toko, alamat, telepon ke default.</p>
            </div>
            <button onClick={() => { if (window.confirm('Reset pengaturan toko ke default?')) { updateSettings(DEFAULT_SETTINGS); setFormData(DEFAULT_SETTINGS); alert('✅ Berhasil direset!'); }}} className="px-4 py-2 border-2 border-orange-300 text-orange-700 rounded-xl font-bold text-sm hover:bg-orange-50 transition flex items-center gap-2 whitespace-nowrap">
              <RotateCcw className="w-4 h-4" /> Reset Pengaturan
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-bold text-sm text-gray-800">Reset Template Quotation</p>
              <p className="text-xs text-gray-500">Kembalikan template, syarat & ketentuan, tanda tangan ke default.</p>
            </div>
            <button onClick={() => { if (window.confirm('Reset template quotation ke default?')) { updateQuotationSettings(DEFAULT_QUOTATION); alert('✅ Berhasil direset!'); }}} className="px-4 py-2 border-2 border-orange-300 text-orange-700 rounded-xl font-bold text-sm hover:bg-orange-50 transition flex items-center gap-2 whitespace-nowrap">
              <RotateCcw className="w-4 h-4" /> Reset Template
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="font-bold text-sm text-red-800">Hapus Semua Data Lokal</p>
              <p className="text-xs text-red-600">Hapus semua data browser — Anda akan logout otomatis.</p>
            </div>
            <button onClick={() => { if (window.confirm('⚠️ Semua data lokal akan dihapus. Lanjutkan?')) { localStorage.removeItem('kasir-storage'); logout(); window.location.reload(); }}} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap shadow-sm">
              <Trash2 className="w-4 h-4" /> Hapus Semua Data
            </button>
          </div>
        </div>
      </div>

      {/* Test Print Portal */}
      {showTestPrint && createPortal(
        <div id="print-area" className="hidden print:block">
          <div style={{
            fontFamily: 'monospace',
            width: formData.thermalPrinter === '80mm' ? '80mm' : '58mm',
            padding: formData.thermalPrinter === '80mm' ? '6px 8px' : '4px 6px',
            fontSize: formData.thermalPrinter === '80mm' ? '13px' : '11px',
            margin: '0 auto',
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '6px', marginBottom: '6px' }}>
              <p style={{ fontWeight: '700', fontSize: formData.thermalPrinter === '80mm' ? '16px' : '14px', margin: '0 0 2px 0' }}>{formData.storeName || 'Nama Toko'}</p>
              <p style={{ fontSize: formData.thermalPrinter === '80mm' ? '11px' : '9px', margin: 0 }}>{formData.storeAddress || 'Alamat Toko'}</p>
              <p style={{ fontSize: formData.thermalPrinter === '80mm' ? '11px' : '9px', margin: 0 }}>Telp: {formData.storePhone || '-'}</p>
            </div>
            <p style={{ textAlign: 'center', fontWeight: '700', margin: '4px 0' }}>*** TEST PRINT ***</p>
            <p style={{ margin: '2px 0' }}>{new Array(formData.thermalPrinter === '80mm' ? 42 : 30).fill('-').join('')}</p>
            <div style={{ margin: '4px 0' }}>
              <p style={{ fontWeight: '600', margin: 0 }}>Contoh Barang A</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>2 x Rp 50.000</span><span style={{ fontWeight: '600' }}>Rp 100.000</span>
              </div>
            </div>
            <div style={{ margin: '4px 0' }}>
              <p style={{ fontWeight: '600', margin: 0 }}>Contoh Barang B</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>1 x Rp 75.000</span><span style={{ fontWeight: '600' }}>Rp 75.000</span>
              </div>
            </div>
            <p style={{ margin: '2px 0' }}>{new Array(formData.thermalPrinter === '80mm' ? 42 : 30).fill('-').join('')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: formData.thermalPrinter === '80mm' ? '15px' : '13px' }}>
              <span>TOTAL</span><span>Rp 175.000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dibayar</span><span>Rp 200.000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
              <span>Kembali</span><span>Rp 25.000</span>
            </div>
            <p style={{ margin: '2px 0' }}>{new Array(formData.thermalPrinter === '80mm' ? 42 : 30).fill('-').join('')}</p>
            <p style={{ textAlign: 'center', margin: '4px 0', fontSize: formData.thermalPrinter === '80mm' ? '11px' : '9px' }}>{formData.receiptFooter || 'Terima kasih atas kunjungan Anda'}</p>
            <p style={{ textAlign: 'center', margin: '4px 0', fontSize: formData.thermalPrinter === '80mm' ? '10px' : '8px', color: '#999' }}>Kertas: {formData.thermalPrinter} • {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Pengaturan;
