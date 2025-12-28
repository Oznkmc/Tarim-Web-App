import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function GubreBorsasi() {
  const { currentUser } = useAuth();
  const [gubreler, setGubreler] = useState([]);
  const [dolarKuru, setDolarKuru] = useState(35.0);
  const [yeniGubre, setYeniGubre] = useState({
    adi: '',
    dolarFiyati: '',
    birim: 'ton',
    aciklama: ''
  });

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

  useEffect(() => {
    gubreleriYukle();
  }, []);

  const gubreleriYukle = async () => {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'gubreBorsasi'), orderBy('tarih', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGubreler(data);
    } catch (error) {
      console.error('Gübre listesi yüklenirken hata:', error);
    }
  };

  const gubreDegisti = (e) => {
    const secilenGubre = gubreTipleri.find(g => g.value === e.target.value);
    if (secilenGubre) {
      const ortalama = (secilenGubre.minFiyat + secilenGubre.maxFiyat) / 2;
      setYeniGubre({
        ...yeniGubre,
        adi: e.target.value,
        dolarFiyati: ortalama.toString()
      });
    }
  };

  const gubreEkle = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const secilenGubre = gubreTipleri.find(g => g.value === yeniGubre.adi);
      const dolarFiyati = parseFloat(yeniGubre.dolarFiyati);
      const tlFiyati = dolarFiyati * dolarKuru;
      
      await addDoc(collection(db, 'gubreBorsasi'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        adi: yeniGubre.adi,
        gubreAdi: secilenGubre ? secilenGubre.label : yeniGubre.adi,
        dolarFiyati: dolarFiyati,
        dolarKuru: dolarKuru,
        tlFiyati: tlFiyati,
        birim: yeniGubre.birim,
        aciklama: yeniGubre.aciklama,
        tarih: serverTimestamp()
      });
      alert('Gübre fiyatı eklendi!');
      setYeniGubre({
        adi: '',
        dolarFiyati: '',
        birim: 'ton',
        aciklama: ''
      });
      gubreleriYukle();
    } catch (error) {
      console.error('Gübre eklenirken hata:', error);
      alert('Gübre eklenirken hata oluştu!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🌱 Gübre Borsası</h1>

      {/* Dolar Kuru Ayarlama */}
      <div className="bg-blue-50 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">💵 Dolar Kuru (TL):</label>
          <input
            type="number"
            step="0.01"
            value={dolarKuru}
            onChange={(e) => setDolarKuru(parseFloat(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg w-32 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">1$ = {dolarKuru} TL</span>
        </div>
      </div>

      {/* Yeni Gübre Fiyatı Ekleme Formu */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Gübre Fiyatı Ekle</h2>
        <form onSubmit={gubreEkle} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gübre Tipi</label>
              <select
                value={yeniGubre.adi}
                onChange={gubreDegisti}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Gübre Seçin</option>
                {gubreTipleri.map(gubre => (
                  <option key={gubre.value} value={gubre.value}>
                    {gubre.label} (${gubre.minFiyat}-${gubre.maxFiyat})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
              <input
                type="number"
                step="0.01"
                value={yeniGubre.dolarFiyati}
                onChange={(e) => setYeniGubre({...yeniGubre, dolarFiyati: e.target.value})}
                placeholder="Ton/Litre başına fiyat ($)"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {yeniGubre.dolarFiyati && (
                <p className="text-sm text-green-600 mt-1">
                  ≈ {(parseFloat(yeniGubre.dolarFiyati) * dolarKuru).toFixed(2)} TL
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birim</label>
              <select
                value={yeniGubre.birim}
                onChange={(e) => setYeniGubre({...yeniGubre, birim: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ton">Ton</option>
                <option value="litre">Litre (Çözelti)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <input
                type="text"
                value={yeniGubre.aciklama}
                onChange={(e) => setYeniGubre({...yeniGubre, aciklama: e.target.value})}
                placeholder="Açıklama (isteğe bağlı)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Gübre Fiyatı Ekle
          </button>
        </form>
      </div>

      {/* Gübre Listesi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Kayıtlı Gübre Fiyatları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gubreler.map((gubre) => (
            <div key={gubre.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌱</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{gubre.birim}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{gubre.gubreAdi}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Dolar:</span> ${gubre.dolarFiyati}/{gubre.birim}
              </p>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {gubre.tlFiyati?.toFixed(2)} TL/{gubre.birim}
              </p>
              <p className="text-xs text-gray-500 mb-2">Kur: {gubre.dolarKuru} TL</p>
              {gubre.aciklama && (
                <p className="text-sm text-gray-600">{gubre.aciklama}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {gubre.tarih?.toDate ? gubre.tarih.toDate().toLocaleDateString('tr-TR') : 'Tarih bilgisi yok'}
              </p>
            </div>
          ))}
        </div>
        {gubreler.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henüz gübre fiyatı eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

export default GubreBorsasi;
