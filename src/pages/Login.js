import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Giriş hatası:', error);
      console.error('Hata kodu:', error.code);
      let errorMessage = 'Giriş başarısız. ';
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage += 'E-posta veya şifre hatalı. Şifrenizi yeni değiştirdiyseniz, lütfen e-postanızdaki linke tıklayıp şifreyi Firebase sayfasında güncelleyin.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage += 'Bu hesap devre dışı bırakılmış.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage += 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin veya şifrenizi sıfırlayın.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage += 'E-posta/şifre girişi etkinleştirilmemiş. Firebase Console\'dan Email/Password authentication\'ı etkinleştirin.';
      } else {
        errorMessage += `${error.message || 'Bir hata oluştu.'} (Kod: ${error.code || 'bilinmiyor'})`;
      }
      
      setError(errorMessage);
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return setError('Lütfen e-posta adresinizi girin.');
    }

    try {
      setError('');
      setMessage('');
      setResetLoading(true);
      await resetPassword(email);
      setMessage('✉️ Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. E-postanızdaki linke tıklayarak yeni şifrenizi belirleyin. Spam klasörünü de kontrol edin.');
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      let errorMessage = 'Şifre sıfırlama başarısız. ';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage += 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage += 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.';
      } else {
        errorMessage += error.message || 'Bir hata oluştu.';
      }
      
      setError(errorMessage);
    }

    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🌾 Tarım Platform</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Giriş Yap</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-green-600 hover:text-green-700 font-semibold text-sm disabled:opacity-50"
          >
            {resetLoading ? 'Gönderiliyor...' : 'Şifremi Unuttum'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Kayıt Ol
            </Link>
          </p>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ Önemli:</strong> Şifre sıfırlama linki e-postanıza gönderildi. 
              Linke tıklayıp Firebase sayfasında yeni şifrenizi belirlemeniz gerekiyor. 
              Sadece bu sayfada yazmak yeterli değil!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
