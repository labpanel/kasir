import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { api } from '../services/api';
import { Store, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.verifyLogin(email, password);
      if (res.success) {
        login(res.user);
        setSuccess(true);
        setTimeout(() => {
          window.location.replace('/');
        }, 1500);
      } else {
        setError(res.error || 'Email atau password salah.');
        setLoading(false);
      }
    } catch {
      setError('Gagal terhubung ke server.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 text-center w-full max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Login Berhasil!</h2>
          <p className="text-gray-500 text-sm">Mengalihkan ke Dashboard...</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden">
            <div className="h-1 bg-blue-500 rounded-full" style={{ animation: 'grow 1.5s linear forwards', width: '0%' }} />
          </div>
        </div>
        <style>{`@keyframes grow { to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Store className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">Kasir App</h1>
          <p className="text-blue-200 mt-1 text-sm">Masuk ke akun Anda</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="nama@toko.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-800 text-sm"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-800 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          &copy; 2026 Kasir App. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
