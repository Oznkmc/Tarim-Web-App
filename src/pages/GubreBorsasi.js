import React, { useState, useEffect } from 'react';

function GubreBorsasi() {
  const [dolarKuru, setDolarKuru] = useState(35.0);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    dolarKuruCek();
  }, []);

  const dolarKuruCek = async () => {
    try {
      setYukleniyor(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      if (data.rates && data.rates.TRY) {
        setDolarKuru(parseFloat(data.rates.TRY.toFixed(2)));
      }
    } catch (error) {
      console.error('Dolar kuru çekilemedi:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  const gubreTipleri = [
    { value: 'ure', label: 'ÜRE', minFiyat: 384, maxFiyat: 413 },
    { value: 'amonyum-nitrat', label: 'AMONYUM NİTRAT', minFiyat: 450, maxFiyat: 600 },
    { value: 'amonyum-sulfat', label: 'AMONYUM SÜLFAT', minFiyat: 540, maxFiyat: 690 },
    { value: 'kalsiyum-amonyum', label: 'KALSİYUM AMONYUM', minFiyat: 400, maxFiyat: 550 },
    { value: 'amonyum-klorur', label: 'AMONYUM KLORUR', minFiyat: 450, maxFiyat: 620 },
    { value: 'dap', label: 'DAP', minFiyat: 900, maxFiyat: 950 },
    { value: 'map', label: 'MAP', minFiyat: 920, maxFiyat: 950 },
    { value: 'tsp', label: 'TSP', minFiyat: 800, maxFiyat: 900 },
    { value: 'ssp', label: 'SSP', minFiyat: 750, maxFiyat: 850 },
    { value: 'potasyum-clorur', label: 'POTASYUM CLORUR', minFiyat: 280, maxFiyat: 350 },
    { value: 'potasyum-sulfat', label: 'POTASYUM SÜLFAT', minFiyat: 510, maxFiyat: 830 },
    { value: 'potasyum-nitrat', label: 'POTASYUM NİTRAT', minFiyat: 800, maxFiyat: 1000 },
    { value: 'potasyum-magnezyum', label: 'POTASYUM MAGNEZYUM SÜLFAT', minFiyat: 600, maxFiyat: 800 },
    { value: 'npk-15-15-15', label: 'NPK 15/15/15', minFiyat: 800, maxFiyat: 950 },
    { value: 'npk-20-20-0', label: 'NPK 20/20/0', minFiyat: 850, maxFiyat: 1000 },
    { value: 'npk-16-16-16', label: 'NPK 16/16/16', minFiyat: 850, maxFiyat: 1000 },
    { value: 'npk-12-12-17', label: 'NPK 12/12/17', minFiyat: 800, maxFiyat: 950 },
    { value: 'npk-10-20-20', label: 'NPK 10/20/20', minFiyat: 850, maxFiyat: 1000 },
    { value: 'npk-8-24-24', label: 'NPK 8/24/24', minFiyat: 400, maxFiyat: 800 },
    { value: 'npk-13-24-12', label: 'NPK 13/24/12', minFiyat: 250, maxFiyat: 500 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🌱 Gübre Borsası</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{yukleniyor ? '⏳ Güncelleniyor...' : `1$ = ${dolarKuru} TL`}</span>
          <button onClick={dolarKuruCek} disabled={yukleniyor} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition">🔄 Kuru Güncelle</button>
        </div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700"><strong>ℹ️ Bilgi:</strong> Aşağıdaki fiyatlar ton başına dolar cinsinden güncel piyasa fiyatlarıdır.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gubreTipleri.map((gubre) => {
          const ortalamaFiyat = (gubre.minFiyat + gubre.maxFiyat) / 2;
          const tlFiyat = ortalamaFiyat * dolarKuru;
          return (
            <div key={gubre.value} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{gubre.label}</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Min Fiyat:</span><span className="font-semibold">${gubre.minFiyat}/ton</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Max Fiyat:</span><span className="font-semibold">${gubre.maxFiyat}/ton</span></div>
                <div className="flex justify-between border-t pt-2"><span className="text-gray-600">Ortalama:</span><span className="font-semibold text-green-600">${ortalamaFiyat.toFixed(0)}/ton</span></div>
                <div className="flex justify-between bg-green-50 p-2 rounded"><span className="text-gray-700 font-semibold">TL Fiyat:</span><span className="font-bold text-green-700">₺{tlFiyat.toFixed(2)}/ton</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GubreBorsasi;
