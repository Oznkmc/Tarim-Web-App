import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function IlacBorsasi() {
  const { currentUser } = useAuth();
  const [ilaclar, setIlaclar] = useState([]);
  const [dolarKuru, setDolarKuru] = useState(35.0);
  const [yeniIlac, setYeniIlac] = useState({
    tip: 'bugday',
    adi: '',
    dolarFiyati: '',
    birim: 'litre',
    aciklama: ''
  });

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

  const mevcutIlaclar = yeniIlac.tip === 'bugday' ? bugdayIlaclari : arpaIlaclari;

  useEffect(() => {
    ilaclariYukle();
  }, []);

  const ilaclariYukle = async () => {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'ilacBorsasi'), orderBy('tarih', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIlaclar(data);
    } catch (error) {
      console.error('İlaç listesi yüklenirken hata:', error);
    }
  };

  const ilacDegisti = (e) => {
    const secilenIlac = mevcutIlaclar.find(i => i.value === e.target.value);
    if (secilenIlac) {
      const ortalama = (secilenIlac.minFiyat + secilenIlac.maxFiyat) / 2;
      setYeniIlac({
        ...yeniIlac,
        adi: e.target.value,
        dolarFiyati: ortalama.toString()
      });
    }
  };

  const ilacEkle = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const secilenIlac = mevcutIlaclar.find(i => i.value === yeniIlac.adi);
      const dolarFiyati = parseFloat(yeniIlac.dolarFiyati);
      const tlFiyati = dolarFiyati * dolarKuru;
      
      await addDoc(collection(db, 'ilacBorsasi'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        tip: yeniIlac.tip,
        adi: yeniIlac.adi,
        ilacAdi: secilenIlac ? secilenIlac.label : yeniIlac.adi,
        dolarFiyati: dolarFiyati,
        dolarKuru: dolarKuru,
        tlFiyati: tlFiyati,
        birim: yeniIlac.birim,
        aciklama: yeniIlac.aciklama,
        tarih: serverTimestamp()
      });
      alert('İlaç fiyatı eklendi!');
      setYeniIlac({
        tip: 'bugday',
        adi: '',
        dolarFiyati: '',
        birim: 'litre',
        aciklama: ''
      });
      ilaclariYukle();
    } catch (error) {
      console.error('İlaç eklenirken hata:', error);
      alert('İlaç eklenirken hata oluştu!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">💊 İlaç Borsası</h1>

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

      {/* Yeni İlaç Fiyatı Ekleme Formu */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">İlaç Fiyatı Ekle</h2>
        <p className="text-sm text-gray-600 mb-4">ℹ️ Tüm ilaçlar sıvı çözelti formundadır.</p>
        <form onSubmit={ilacEkle} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Tipi</label>
              <select
                value={yeniIlac.tip}
                onChange={(e) => setYeniIlac({...yeniIlac, tip: e.target.value, adi: '', dolarFiyati: ''})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="bugday">🌾 Buğday İlaçları</option>
                <option value="arpa">🌾 Arpa İlaçları</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İlaç</label>
              <select
                value={yeniIlac.adi}
                onChange={ilacDegisti}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">İlaç Seçin</option>
                {mevcutIlaclar.map(ilac => (
                  <option key={ilac.value} value={ilac.value}>
                    {ilac.label} (${ilac.minFiyat}-${ilac.maxFiyat}/ton)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($/Ton)</label>
              <input
                type="number"
                step="0.01"
                value={yeniIlac.dolarFiyati}
                onChange={(e) => setYeniIlac({...yeniIlac, dolarFiyati: e.target.value})}
                placeholder="Ton başına fiyat ($)"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {yeniIlac.dolarFiyati && (
                <p className="text-sm text-purple-600 mt-1">
                  ≈ {(parseFloat(yeniIlac.dolarFiyati) * dolarKuru).toFixed(2)} TL/ton
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birim</label>
              <select
                value={yeniIlac.birim}
                onChange={(e) => setYeniIlac({...yeniIlac, birim: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="litre">Litre (Çözelti)</option>
                <option value="ton">Ton (1000 L)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <input
                type="text"
                value={yeniIlac.aciklama}
                onChange={(e) => setYeniIlac({...yeniIlac, aciklama: e.target.value})}
                placeholder="Açıklama (isteğe bağlı)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            İlaç Fiyatı Ekle
          </button>
        </form>
      </div>

      {/* İlaç Listesi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Kayıtlı İlaç Fiyatları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ilaclar.map((ilac) => (
            <div key={ilac.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💊</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {ilac.tip === 'bugday' ? 'Buğday' : 'Arpa'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{ilac.ilacAdi}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Dolar:</span> ${ilac.dolarFiyati}/{ilac.birim}
              </p>
              <p className="text-2xl font-bold text-purple-600 mb-2">
                {ilac.tlFiyati?.toFixed(2)} TL/{ilac.birim}
              </p>
              <p className="text-xs text-gray-500 mb-2">Kur: {ilac.dolarKuru} TL</p>
              {ilac.aciklama && (
                <p className="text-sm text-gray-600">{ilac.aciklama}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {ilac.tarih?.toDate ? ilac.tarih.toDate().toLocaleDateString('tr-TR') : 'Tarih bilgisi yok'}
              </p>
            </div>
          ))}
        </div>
        {ilaclar.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henüz ilaç fiyatı eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

export default IlacBorsasi;
