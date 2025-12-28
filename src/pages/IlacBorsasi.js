import React, { useState, useEffect } from 'react';

function IlacBorsasi() {
  const [dolarKuru, setDolarKuru] = useState(35.0);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aktifTip, setAktifTip] = useState('bugday');

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

  const arpaIlaclari = [
    { value: 'prosaro', label: 'Prosaro (Fungisit)', minFiyat: 8000, maxFiyat: 12000 },
    { value: 'proline', label: 'Proline (Fungisit)', minFiyat: 6000, maxFiyat: 10000 },
    { value: 'fosburi', label: 'Fosburi Super (Herbisit)', minFiyat: 1800, maxFiyat: 2800 },
    { value: 'huskie', label: 'Huskie EC (Herbisit)', minFiyat: 2000, maxFiyat: 3200 },
    { value: 'decis', label: 'Decis Forte OD (İnsektisit)', minFiyat: 10000, maxFiyat: 15000 }
  ];

  const bugdayIlaclari = [
    { value: 'raxil', label: 'Raxil Star (Fungisit)', minFiyat: 9000, maxFiyat: 13000 },
    { value: 'folicur', label: 'Folicur SC (Fungisit)', minFiyat: 7000, maxFiyat: 11000 },
    { value: 'giddo', label: 'Giddo (Herbisit)', minFiyat: 1700, maxFiyat: 2700 },
    { value: 'atlantis', label: 'Atlantis Max OD (Herbisit)', minFiyat: 2200, maxFiyat: 3500 },
    { value: 'thunder', label: 'Thunder OD (İnsektisit)', minFiyat: 9500, maxFiyat: 14000 }
  ];

  const mevcutIlaclar = aktifTip === 'bugday' ? bugdayIlaclari : arpaIlaclari;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> İlaç Borsası</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {yukleniyor ? ' Güncelleniyor...' : `1$ = ${dolarKuru} TL`}
          </span>
          <button onClick={dolarKuruCek} disabled={yukleniyor} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition">
             Kuru Güncelle
          </button>
        </div>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700"><strong>ℹ Bilgi:</strong> Aşağıdaki fiyatlar litre/ton başına dolar cinsinden güncel piyasa fiyatlarıdır.</p>
      </div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setAktifTip('bugday')} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${aktifTip === 'bugday' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}> Buğday İlaçları</button>
        <button onClick={() => setAktifTip('arpa')} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${aktifTip === 'arpa' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}> Arpa İlaçları</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mevcutIlaclar.map((ilac) => {
          const ortalamaFiyat = (ilac.minFiyat + ilac.maxFiyat) / 2;
          const tlFiyat = ortalamaFiyat * dolarKuru;
          return (
            <div key={ilac.value} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{ilac.label}</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Min Fiyat:</span><span className="font-semibold">${ilac.minFiyat}/lt</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Max Fiyat:</span><span className="font-semibold">${ilac.maxFiyat}/lt</span></div>
                <div className="flex justify-between border-t pt-2"><span className="text-gray-600">Ortalama:</span><span className="font-semibold text-purple-600">${ortalamaFiyat.toFixed(0)}/lt</span></div>
                <div className="flex justify-between bg-purple-50 p-2 rounded"><span className="text-gray-700 font-semibold">TL Fiyat:</span><span className="font-bold text-purple-700">₺{tlFiyat.toFixed(2)}/lt</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IlacBorsasi;