import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function TohumBorsasi() {
  const { currentUser } = useAuth();
  const [tohumlar, setTohumlar] = useState([]);
  const [yeniTohum, setYeniTohum] = useState({
    tip: 'bugday',
    cesit: '',
    fiyat: '',
    birim: 'kg',
    aciklama: ''
  });

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

  const mevcutCesitler = yeniTohum.tip === 'bugday' ? bugdayCesitleri : arpaCesitleri;

  useEffect(() => {
    tohumlariYukle();
  }, []);

  const tohumlariYukle = async () => {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'tohumBorsasi'), orderBy('tarih', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTohumlar(data);
    } catch (error) {
      console.error('Tohum listesi yüklenirken hata:', error);
    }
  };

  const cesitDegisti = (e) => {
    const secilenCesit = mevcutCesitler.find(c => c.value === e.target.value);
    setYeniTohum({
      ...yeniTohum,
      cesit: e.target.value,
      fiyat: secilenCesit ? secilenCesit.fiyat : ''
    });
  };

  const tohumEkle = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const secilenCesit = mevcutCesitler.find(c => c.value === yeniTohum.cesit);
      await addDoc(collection(db, 'tohumBorsasi'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        tip: yeniTohum.tip,
        cesit: yeniTohum.cesit,
        cesitAdi: secilenCesit ? secilenCesit.label : '',
        fiyat: parseFloat(yeniTohum.fiyat),
        birim: yeniTohum.birim,
        aciklama: yeniTohum.aciklama,
        tarih: serverTimestamp()
      });
      alert('Tohum fiyatı eklendi!');
      setYeniTohum({
        tip: 'bugday',
        cesit: '',
        fiyat: '',
        birim: 'kg',
        aciklama: ''
      });
      tohumlariYukle();
    } catch (error) {
      console.error('Tohum eklenirken hata:', error);
      alert('Tohum eklenirken hata oluştu!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🌾 Tohum Borsası</h1>

      {/* Yeni Tohum Fiyatı Ekleme Formu */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tohum Fiyatı Ekle</h2>
        <form onSubmit={tohumEkle} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Tipi</label>
              <select
                value={yeniTohum.tip}
                onChange={(e) => setYeniTohum({...yeniTohum, tip: e.target.value, cesit: '', fiyat: ''})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="bugday">🌾 Buğday</option>
                <option value="arpa">🌾 Arpa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Çeşit</label>
              <select
                value={yeniTohum.cesit}
                onChange={cesitDegisti}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Çeşit Seçin</option>
                {mevcutCesitler.map(cesit => (
                  <option key={cesit.value} value={cesit.value}>
                    {cesit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (TL/kg)</label>
              <input
                type="number"
                step="0.01"
                value={yeniTohum.fiyat}
                onChange={(e) => setYeniTohum({...yeniTohum, fiyat: e.target.value})}
                placeholder="Fiyat"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birim</label>
              <select
                value={yeniTohum.birim}
                onChange={(e) => setYeniTohum({...yeniTohum, birim: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="ton">Ton</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={yeniTohum.aciklama}
              onChange={(e) => setYeniTohum({...yeniTohum, aciklama: e.target.value})}
              placeholder="Açıklama (isteğe bağlı)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Tohum Ekle
          </button>
        </form>
      </div>

      {/* Tohum Listesi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Kayıtlı Tohum Fiyatları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tohumlar.map((tohum) => (
            <div key={tohum.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌾</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {tohum.tip === 'bugday' ? 'Buğday' : 'Arpa'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{tohum.cesitAdi || tohum.cesit}</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {tohum.fiyat} TL / {tohum.birim}
              </p>
              {tohum.aciklama && (
                <p className="text-sm text-gray-600 mb-2">{tohum.aciklama}</p>
              )}
              <p className="text-xs text-gray-400">
                {tohum.tarih?.toDate ? tohum.tarih.toDate().toLocaleDateString('tr-TR') : 'Tarih bilgisi yok'}
              </p>
            </div>
          ))}
        </div>
        {tohumlar.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henüz tohum fiyatı eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

export default TohumBorsasi;
