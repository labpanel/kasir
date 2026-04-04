import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
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
