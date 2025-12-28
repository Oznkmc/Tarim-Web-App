import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return `px-4 py-2 rounded-lg transition duration-300 ${
      isActive(path)
        ? 'bg-white text-green-600 font-semibold'
        : 'text-white hover:bg-green-700'
    }`;
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4">
          <Link to="/" className="text-white text-2xl font-bold hover:text-green-100 transition">
            🌾 Tarım Platformu
          </Link>
          
          <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
            <Link to="/" className={linkClass('/')}>
              Ana Sayfa
            </Link>
            <Link to="/maliyet-hesaplama" className={linkClass('/maliyet-hesaplama')}>
              Maliyet Hesaplama
            </Link>
            <Link to="/gubre-borsasi" className={linkClass('/gubre-borsasi')}>
              Gübre Borsası
            </Link>
            <Link to="/tohum-borsasi" className={linkClass('/tohum-borsasi')}>
              Tohum Borsası
            </Link>
            <Link to="/ilac-borsasi" className={linkClass('/ilac-borsasi')}>
              İlaç Borsası
            </Link>
            <Link to="/gecmis-islemler" className={linkClass('/gecmis-islemler')}>
              Geçmiş İşlemler
            </Link>

            {currentUser && (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  <span>👤</span>
                  <span className="hidden md:inline">{currentUser.email}</span>
                  <span>▼</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      🚪 Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
