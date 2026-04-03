import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Store, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=new password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckEmail = (e) => {
    e.preventDefault();
    if (!email) { setError('Masukkan alamat email.'); return; }
    setError('');
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirm) { setError('Semua kolom wajib diisi.'); return; }
    if (newPassword.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (newPassword !== confirm) { setError('Konfirmasi password tidak cocok.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await api.resetPassword(email, newPassword);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Email tidak ditemukan di sistem.');
        setLoading(false);
      }
    } catch {
      setError('Gagal terhubung ke server.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 text-center w-full max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Password Berhasil Diubah!</h2>
          <p className="text-gray-500 text-sm">Silakan masuk menggunakan password baru Anda.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Ke Halaman Login
          </button>
        </div>
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
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-200 mt-1 text-sm">
            {step === 1 ? 'Masukkan email terdaftar Anda' : `Reset password untuk ${email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6 px-2">
          {[1, 2].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCheckEmail} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Terdaftar</label>
                <input
                  type="email"
                  placeholder="nama@toko.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-800 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition text-sm"
              >
                Lanjutkan
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-800 text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-800 text-sm"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="flex items-center gap-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center text-sm"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  ) : 'Simpan Password Baru'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/login" className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
