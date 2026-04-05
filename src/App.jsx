import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Laporan from './pages/Laporan';
import Pengaturan from './pages/Pengaturan';
import StokBarang from './pages/StokBarang';
import Pelanggan from './pages/Pelanggan';
import Supplier from './pages/Supplier';
import Quotation from './pages/Quotation';
import Riwayat from './pages/Riwayat';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import useStore from './store/useStore';
import api from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { apiError, setApiError } = useStore();

  const checkConnection = async () => {
    try {
      await api.getProducts();
      setApiError(null);
    } catch (err) {
      if (err.message.includes('fetch')) {
        setApiError('Gagal terhubung ke Google Sheets. Silakan cek koneksi internet atau pengaturan Deployment Apps Script Anda.');
      } else {
        setApiError(err.message);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        
        {/* Connection Error Banner */}
        {apiError && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm animate-pulse-slow">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{apiError} <strong>(Pastikan Who has access = "Anyone")</strong></span>
            </div>
            <button 
              onClick={checkConnection}
              className="bg-white text-red-600 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={12} /> Cek Lagi
            </button>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const PermissionRoute = ({ children, permKey }) => {
  const user = useStore((state) => state.user);
  const rolePermissions = useStore((state) => state.rolePermissions);
  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = user.role === 'Admin';
  const userPerms = rolePermissions?.userPermissions || [];
  if (!isAdmin && permKey && !userPerms.includes(permKey)) {
    return <Layout><div className="flex items-center justify-center h-full"><div className="text-center p-8 bg-white rounded-2xl shadow-sm border max-w-sm"><p className="text-4xl mb-4">🔒</p><h2 className="text-xl font-bold text-gray-800 mb-2">Akses Ditolak</h2><p className="text-gray-500 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi Admin.</p></div></div></Layout>;
  }
  return <Layout>{children}</Layout>;
};

const GuestRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const theme = useStore((state) => state.settings.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Handle mobile 100vh issue
  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Guest-only routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Protected routes with permission keys */}
        <Route path="/" element={<PermissionRoute permKey="dashboard"><Dashboard /></PermissionRoute>} />
        <Route path="/transaksi" element={<PermissionRoute permKey="transaksi"><Transaksi /></PermissionRoute>} />
        <Route path="/stok" element={<PermissionRoute permKey="stok"><StokBarang /></PermissionRoute>} />
        <Route path="/pelanggan" element={<PermissionRoute permKey="pelanggan"><Pelanggan /></PermissionRoute>} />
        <Route path="/supplier" element={<PermissionRoute permKey="supplier"><Supplier /></PermissionRoute>} />
        <Route path="/quotation" element={<PermissionRoute permKey="quotation"><Quotation /></PermissionRoute>} />
        <Route path="/riwayat" element={<PermissionRoute permKey="riwayat"><Riwayat /></PermissionRoute>} />
        <Route path="/laporan" element={<PermissionRoute permKey="laporan"><Laporan /></PermissionRoute>} />
        <Route path="/pengaturan" element={<PermissionRoute permKey="pengaturan"><Pengaturan /></PermissionRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
