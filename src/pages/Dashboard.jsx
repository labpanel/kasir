import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DollarSign, ShoppingBag, TrendingUp, Package } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && (
        <p className="text-xs font-medium text-green-500 mt-2 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </p>
      )}
    </div>
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    salesToday: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Simulating fetching stats
    const fetchDashboardStats = async () => {
      const products = await api.getProducts();
      setStats({
        products: products.length,
        salesToday: 12,
        totalRevenue: 1540000,
      });
    };
    fetchDashboardStats();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Selamat datang kembali! Berikut ringkasan toko hari ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pendapatan Hari Ini" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={DollarSign} 
          trend="+8.5% dari kemarin" 
        />
        <StatCard 
          title="Transaksi Harian" 
          value={stats.salesToday.toString()} 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="Total Produk" 
          value={stats.products.toString()} 
          icon={Package} 
        />
        <StatCard 
          title="Pertumbuhan" 
          value="12.5%" 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terakhir</h2>
          <div className="text-sm text-gray-500 text-center py-10">
            Belum ada aktivitas hari ini.
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Stok Menipis</h2>
          <div className="text-sm text-gray-500 text-center py-10">
            Semua stok aman.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
