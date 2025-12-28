import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function GecmisIslemler() {
  const { currentUser } = useAuth();
  const [maliyetler, setMaliyetler] = useState([]);
  const [filtreYil, setFiltreYil] = useState('');
  const [toplamlar, setToplamlar] = useState({
    gubre: 0,
    tohum: 0,
    ilac: 0,
    su: 0,
    toplam: 0
  });

  useEffect(() => {
    if (currentUser) {
      maliyetleriYukle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    hesaplaToplamlar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maliyetler, filtreYil]);

  const maliyetleriYukle = async () => {
    try {
      if (!currentUser) {
        console.log('Kullanıcı giriş yapmamış');
        return;
      }

      const db = getFirestore();
      // Önce sadece userId ile filtrele, sonra client-side sırala
      const q = query(
        collection(db, 'maliyetler'), 
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          tarih: docData.tarih?.toDate() || new Date()
        };
      });
      
      // Client-side sıralama
      data.sort((a, b) => b.tarih - a.tarih);
      
      setMaliyetler(data);
      console.log('Yüklenen maliyet sayısı:', data.length);
    } catch (error) {
      console.error('Maliyetler yüklenirken hata:', error);
      console.error('Hata detayı:', error);
      alert('Veriler yüklenirken hata oluştu: ' + error.message);
    }
  };

  const hesaplaToplamlar = () => {
    let filtreliMaliyetler = maliyetler;
    
    if (filtreYil) {
      filtreliMaliyetler = maliyetler.filter(m => 
        m.tarih.getFullYear().toString() === filtreYil
      );
    }

    const toplamGubre = filtreliMaliyetler.reduce((sum, m) => sum + (m.gubre?.maliyet || 0), 0);
    const toplamTohum = filtreliMaliyetler.reduce((sum, m) => sum + (m.tohum?.maliyet || 0), 0);
    const toplamIlac = filtreliMaliyetler.reduce((sum, m) => sum + (m.ilac?.maliyet || 0), 0);
    const toplamSu = filtreliMaliyetler.reduce((sum, m) => sum + (m.suMasrafi || 0), 0);
    
    setToplamlar({
      gubre: toplamGubre,
      tohum: toplamTohum,
      ilac: toplamIlac,
      su: toplamSu,
      toplam: toplamGubre + toplamTohum + toplamIlac + toplamSu
    });
  };

  const mevcutYillar = [...new Set(maliyetler.map(m => m.tarih.getFullYear()))].sort((a, b) => b - a);

  const filtreliMaliyetler = filtreYil 
    ? maliyetler.filter(m => m.tarih.getFullYear().toString() === filtreYil)
    : maliyetler;

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Lütfen giriş yapın.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Geçmiş İşlemler</h1>

      {/* Filtre ve İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Filtre */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filtrele</h2>
          <select
            value={filtreYil}
            onChange={(e) => setFiltreYil(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tüm Yıllar</option>
            {mevcutYillar.map(yil => (
              <option key={yil} value={yil}>{yil}</option>
            ))}
          </select>
        </div>

        {/* Toplam İstatistikler */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">
            {filtreYil ? `${filtreYil} Yılı Toplamları` : 'Genel Toplamlar'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm opacity-90">Gübre</p>
              <p className="text-lg font-bold">₺{toplamlar.gubre.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Tohum</p>
              <p className="text-lg font-bold">₺{toplamlar.tohum.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">İlaç</p>
              <p className="text-lg font-bold">₺{toplamlar.ilac.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Su</p>
              <p className="text-lg font-bold">₺{toplamlar.su.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm opacity-90">Toplam</p>
              <p className="text-2xl font-bold">₺{toplamlar.toplam.toLocaleString('tr-TR', {maximumFractionDigits: 0})}</p>
            </div>
          </div>
        </div>
      </div>

      {/* İşlem Listesi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">İşlem Geçmişi</h2>
        {filtreliMaliyetler.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">📋 Henüz kayıtlı işlem bulunmuyor</p>
            <p className="text-gray-400 text-sm">Maliyet Hesaplama sayfasından yeni bir hesaplama kaydedin</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtreliMaliyetler.map((maliyet) => (
            <div key={maliyet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {maliyet.tarih.toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-gray-600">Dolar Kuru: ${maliyet.dolarKuru}</p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-2xl font-bold text-green-600">
                    ₺{maliyet.toplamMaliyet?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gübre */}
                {maliyet.gubre && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-green-700 mb-1">GÜBRE</p>
                    <p className="text-sm text-gray-700">{maliyet.gubre.tipi}</p>
                    <p className="text-xs text-gray-600">{maliyet.gubre.miktar} ton × ${maliyet.gubre.tonFiyati}/ton</p>
                    <p className="text-lg font-bold text-green-700">
                      ₺{maliyet.gubre.maliyet?.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                )}

                {/* Tohum */}
                {maliyet.tohum && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1">TOHUM</p>
                    <p className="text-sm text-gray-700">{maliyet.tohum.tipi}</p>
                    <p className="text-xs text-gray-600">{maliyet.tohum.miktar} kg × ${maliyet.tohum.dolarFiyati}</p>
                    <p className="text-lg font-bold text-blue-700">
                      ₺{maliyet.tohum.maliyet?.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                )}

                {/* İlaç */}
                {maliyet.ilac && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-purple-700 mb-1">İLAÇ</p>
                    <p className="text-sm text-gray-700">{maliyet.ilac.tipi}</p>
                    <p className="text-xs text-gray-600">{maliyet.ilac.miktar} lt/kg × ${maliyet.ilac.dolarFiyati}</p>
                    <p className="text-lg font-bold text-purple-700">
                      ₺{maliyet.ilac.maliyet?.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                )}

                {/* Su */}
                {maliyet.suMasrafi > 0 && (
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-cyan-700 mb-1">SU MASRAFI</p>
                    <p className="text-lg font-bold text-cyan-700">
                      ₺{maliyet.suMasrafi?.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GecmisIslemler;
