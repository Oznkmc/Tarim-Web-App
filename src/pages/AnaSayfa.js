import React from 'react';
import { Link } from 'react-router-dom';

function AnaSayfa() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Tarımsal Yönetim Platformu
        </h1>
        <p className="text-xl text-gray-600">
          Tarımsal maliyetlerinizi hesaplayın ve yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Maliyet Hesaplama */}
        <Link to="/maliyet-hesaplama" className="group">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105 text-white">
            <div className="text-5xl mb-4">🧮</div>
            <h2 className="text-2xl font-bold mb-3">Maliyet Hesaplama</h2>
            <p className="text-green-100">Gübre, tohum, ilaç ve su masraflarınızı hesaplayın</p>
          </div>
        </Link>

        {/* Gübre Borsası */}
        <Link to="/gubre-borsasi" className="group">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105 text-white">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold mb-3">Gübre Borsası</h2>
            <p className="text-emerald-100">Gübre fiyatlarını görüntüleyin ve ekleyin</p>
          </div>
        </Link>

        {/* Tohum Borsası */}
        <Link to="/tohum-borsasi" className="group">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105 text-white">
            <div className="text-5xl mb-4">🌾</div>
            <h2 className="text-2xl font-bold mb-3">Tohum Borsası</h2>
            <p className="text-blue-100">Tohum çeşitlerini ve fiyatlarını yönetin</p>
          </div>
        </Link>

        {/* İlaç Borsası */}
        <Link to="/ilac-borsasi" className="group">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105 text-white">
            <div className="text-5xl mb-4">💊</div>
            <h2 className="text-2xl font-bold mb-3">İlaç Borsası</h2>
            <p className="text-purple-100">Tarım ilaçları ve fiyatlarını takip edin</p>
          </div>
        </Link>

        {/* Geçmiş İşlemler */}
        <Link to="/gecmis-islemler" className="group">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105 text-white">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-3">Geçmiş İşlemler</h2>
            <p className="text-orange-100">Önceki dönem harcamalarınızı görüntüleyin</p>
          </div>
        </Link>

        {/* Bilgilendirme */}
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-5xl mb-4">ℹ️</div>
          <h2 className="text-2xl font-bold mb-3">Bilgilendirme</h2>
          <p className="text-gray-100">Bu platform tarımsal maliyet yönetimi için tasarlanmıştır</p>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Platform Özellikleri</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Dolar kuru bazlı maliyet hesaplama</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Gübre, tohum ve ilaç için ayrı borsa sistemi</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Geçmiş işlem kayıtları ve analiz</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Detaylı maliyet raporları</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AnaSayfa;
