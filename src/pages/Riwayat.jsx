import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, ShoppingBag, Truck, FileText, Calendar, Filter, Eye, FileOutput, Loader2, ArrowUpDown } from 'lucide-react';
import useStore from '../store/useStore';

const Riwayat = () => {
  const [transactions, setTransactions] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingPdfId, setGeneratingPdfId] = useState(null);
  const { settings, transactionSettings, quotationSettings } = useStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transRes, quoRes] = await Promise.all([
        api.getTransactions(),
        api.getQuotations()
      ]);
      setTransactions(transRes || []);
      setQuotations(quoRes || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

  // Parse items safely
  const parseItems = (itemsStr) => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  // Combine and format data based on tab

  const handleGeneratePdf = async (row) => {
    if (row.raw.pdfLink) {
      window.open(row.raw.pdfLink, '_blank');
      return;
    }

    setGeneratingPdfId(row.id);
    try {
      let res;
      if (row.type === 'Quotation') {
        const parsedSettings = parseItems(row.raw.settings); // In quotation, settings might be stored, but we pass overrides
        res = await api.getQuotationPdfLink({ ...row.raw, settings, qSettings: quotationSettings });
      } else {
        res = await api.getTransactionPdfLink({ ...row.raw, settings, tSettings: transactionSettings });
      }
      if (res.success) {
        window.open(res.url, '_blank');
        fetchData();
      } else {
        alert('Gagal mendownload PDF: ' + res.error);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat membuat PDF.');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const getDisplayData = () => {
    let combined = [];

    transactions.forEach(t => {
      combined.push({
        id: t.receiptNo || `TRX-${new Date(t.date).getTime()}`,
        date: new Date(t.date),
        type: t.type || 'Penjualan',
        name: t.type === 'Pembelian' ? t.supplierName : t.customerName,
        total: t.subtotal || 0,
        itemsStr: t.items,
        status: 'Selesai',
        raw: t
      });
    });

    quotations.forEach(q => {
      combined.push({
        id: q.quoNo || `QO-${new Date(q.date).getTime()}`,
        date: new Date(q.date),
        type: 'Quotation',
        name: q.customerId || 'Pelanggan',
        total: q.total || 0,
        itemsStr: q.items,
        status: q.status || 'Menunggu',
        raw: q
      });
    });

    // Sort based on sortOrder
    if (sortOrder === 'Terbaru') {
      combined.sort((a, b) => b.date - a.date);
    } else if (sortOrder === 'Terlama') {
      combined.sort((a, b) => a.date - b.date);
    } else if (sortOrder === 'Tertinggi') {
      combined.sort((a, b) => b.total - a.total);
    } else if (sortOrder === 'Terendah') {
      combined.sort((a, b) => a.total - b.total);
    }

    // Filter by Tab
    if (activeTab !== 'Semua') {
      combined = combined.filter(item => item.type === activeTab);
    }

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      combined = combined.filter(item => 
        item.id.toLowerCase().includes(lowerSearch) || 
        (item.name && item.name.toLowerCase().includes(lowerSearch))
      );
    }


    // Filter by Date Range
    if (startDate) {
      combined = combined.filter(item => {
        const d = new Date(item.date);
        d.setHours(0,0,0,0);
        const s = new Date(startDate);
        s.setHours(0,0,0,0);
        return d >= s;
      });
    }
    if (endDate) {
      combined = combined.filter(item => {
        const d = new Date(item.date);
        d.setHours(0,0,0,0);
        const e = new Date(endDate);
        e.setHours(0,0,0,0);
        return d <= e;
      });
    }

    return combined;
  };

  const handleStatusChange = async (quoNo, newStatus) => {
    try {
      await api.updateQuotationStatus(quoNo, newStatus);
      fetchData();
    } catch {
      alert('Gagal memperbarui status quotation.');
    }
  };

  const displayData = getDisplayData();

  const getIconForType = (type) => {
    switch(type) {
      case 'Penjualan': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Pembelian': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Quotation': return <FileText className="w-4 h-4 text-amber-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBadgeForType = (type) => {
    switch(type) {
      case 'Penjualan': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pembelian': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Quotation': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-500 text-sm">Lihat rekam jejak penjualan, pembelian, dan penawaran.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          {['Semua', 'Penjualan', 'Pembelian', 'Quotation'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari referensi / nama..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <Calendar className="w-4 h-4" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Dari:</span>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="outline-none bg-transparent font-medium cursor-pointer text-xs"
                />
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Sampai:</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="outline-none bg-transparent font-medium cursor-pointer text-xs"
                />
              </div>
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-red-500 hover:text-red-700 font-bold ml-1" title="Hapus Filter Tanggal">✕</button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <ArrowUpDown className="w-4 h-4" />
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="outline-none bg-transparent font-medium cursor-pointer"
              >
                <option value="Terbaru">Terbaru</option>
                <option value="Terlama">Terlama</option>
                <option value="Tertinggi">Nilai Tertinggi</option>
                <option value="Terendah">Nilai Terendah</option>
              </select>
            </div>
            <button onClick={fetchData} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <Filter className="w-4 h-4" /> Segarkan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent flex rounded-full mx-auto mb-4"></div>
              Memuat Riwayat...
            </div>
          ) : displayData.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Tidak ada riwayat transaksi ditemukan.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Tipe & Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Referensi</th>
                  <th className="px-6 py-4 font-semibold">Pihak Terkait</th>
                  <th className="px-6 py-4 font-semibold text-right">Nilai Transaksi</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Aksi / Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayData.map((row, idx) => {
                  const itemsCount = parseItems(row.itemsStr).length;
                  return (
                    <tr key={`${row.id}-${idx}`} className="hover:bg-gray-50/50 transition group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getBadgeForType(row.type)}`}>
                            {getIconForType(row.type)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{row.type}</p>
                            <p className="text-xs text-gray-500">{row.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{row.id}</p>
                        <p className="text-xs text-gray-500">{itemsCount} Item Barang</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-800">{row.name || '-'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <p className="text-sm font-bold text-gray-900">{formatIDR(row.total)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {row.type === 'Quotation' ? (
                          <select 
                            value={row.status} 
                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border shadow-sm transition hover:scale-105 ${
                              row.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                              row.status === 'Ditolak' ? 'bg-rose-100 text-rose-700 border-rose-200' : 
                              'bg-amber-100 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="Menunggu">Menunggu</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Ditolak">Ditolak</option>
                          </select>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {row.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {row.raw.pdfLink ? (
                          <button onClick={() => window.open(row.raw.pdfLink, '_blank')} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition">
                            <Eye className="w-3.5 h-3.5" /> Lihat PDF
                          </button>
                        ) : (
                          <button onClick={() => handleGeneratePdf(row)} disabled={generatingPdfId === row.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-white hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {generatingPdfId === row.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileOutput className="w-3.5 h-3.5" />} 
                            {generatingPdfId === row.id ? 'Memproses...' : 'Generate PDF'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Riwayat;
