import { useState } from 'react';
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
import Quotation from './pages/Quotation';
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

const GuestRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest-only routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transaksi" element={<ProtectedRoute><Transaksi /></ProtectedRoute>} />
        <Route path="/stok" element={<ProtectedRoute><StokBarang /></ProtectedRoute>} />
        <Route path="/pelanggan" element={<ProtectedRoute><Pelanggan /></ProtectedRoute>} />
        <Route path="/quotation" element={<ProtectedRoute><Quotation /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
        <Route path="/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
