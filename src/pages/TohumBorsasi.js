import React, { useState } from 'react';

function TohumBorsasi() {
  const [aktifTip, setAktifTip] = useState('bugday');

  const bugdayCesitleri = [
    { value: 'ekmeklik-kirmizi', label: 'Ekmeklik Buğday – Kırmızı Sert', fiyat: '13.6' },
    { value: 'mavi', label: 'Mavi Buğday', fiyat: '12.875' },
    { value: 'sari', label: 'Sarı Buğday', fiyat: '9.99' },
    { value: 'makarnalık', label: 'Makarnalık Buğday (Durum)', fiyat: '13.25' },
    { value: 'yumusak', label: 'Yumuşak Buğday', fiyat: '13.5' }
  ];

  const arpaCesitleri = [
    { value: 'yemlik', label: 'Yemlik Arpa (6 sıralı)', fiyat: '11.72' },
    { value: 'maltlik', label: 'Maltlık Arpa (2 sıralı)', fiyat: '8.375' },
    { value: 'kavuzsuz', label: 'Kavuzsuz Arpa', fiyat: '9.75' },
    { value: 'kislik', label: 'Kışlık Arpa', fiyat: '11.075' },
    { value: 'yazlik', label: 'Yazlık Arpa', fiyat: '11.075' }
  ];

  const mevcutCesitler = aktifTip === 'bugday' ? bugdayCesitleri : arpaCesitleri;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🌾 Tohum Borsası</h1>
      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700"><strong>ℹ️ Bilgi:</strong> Aşağıdaki fiyatlar kg başına TL cinsinden güncel piyasa fiyatlarıdır.</p>
      </div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setAktifTip('bugday')} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${aktifTip === 'bugday' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>🌾 Buğday</button>
        <button onClick={() => setAktifTip('arpa')} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${aktifTip === 'arpa' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>🌾 Arpa</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mevcutCesitler.map((tohum) => (
          <div key={tohum.value} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{tohum.label}</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center"><span className="text-gray-700 font-semibold">Fiyat:</span><span className="text-2xl font-bold text-green-700">₺{tohum.fiyat}/kg</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TohumBorsasi;
