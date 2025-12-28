import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function MaliyetHesaplama() {
  const { currentUser } = useAuth();
  const [dolarKuru, setDolarKuru] = useState(35.0);
  const [kuruYukleniyor, setKuruYukleniyor] = useState(false);
  const [urunTipi, setUrunTipi] = useState('bugday');
  
  // Dolar kurunu çek
  useEffect(() => {
    fetchDolarKuru();
  }, []);

  const fetchDolarKuru = async () => {
    try {
      setKuruYukleniyor(true);
      // exchangerate-api.com - ücretsiz API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates && data.rates.TRY) {
        const kur = data.rates.TRY;
        setDolarKuru(parseFloat(kur.toFixed(2)));
        console.log('Güncel dolar kuru:', kur);
      }
    } catch (error) {
      console.error('Dolar kuru çekilemedi:', error);
      // Hata durumunda varsayılan değer kalacak
    } finally {
      setKuruYukleniyor(false);
    }
  };
  
  // Gübre Bilgileri
  const [gubreler, setGubreler] = useState([
    { tip: '', tlFiyati: '', miktar: '', birim: 'ton' }
  ]);

  // Tohum Bilgileri
  const [tohum, setTohum] = useState({
    cesit: '',
    fiyatTL: '',
    miktar: '',
    birim: 'kg'
  });

  // İlaç Bilgileri
  const [ilaclar, setIlaclar] = useState([
    { adi: '', tlFiyati: '', miktar: '', birim: 'litre' }
  ]);

  // Su Masrafı
  const [suMasrafi, setSuMasrafi] = useState('');

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

  const bugdayCesitleri = [
    { value: 'ekmeklik-kirmizi', label: 'Ekmeklik Buğday – Kırmızı Sert', fiyat: 13.6 },
    { value: 'mavi', label: 'Mavi Buğday', fiyat: 12.875 },
    { value: 'sari', label: 'Sarı Buğday', fiyat: 9.99 },
    { value: 'makarnalık', label: 'Makarnalık Buğday', fiyat: 13.25 },
    { value: 'yumusak', label: 'Yumuşak Buğday', fiyat: 13.5 }
  ];

  const arpaCesitleri = [
    { value: 'yemlik', label: 'Yemlik Arpa', fiyat: 11.72 },
    { value: 'maltlik', label: 'Maltlık Arpa', fiyat: 8.375 },
    { value: 'kavuzsuz', label: 'Kavuzsuz Arpa', fiyat: 9.75 },
    { value: 'kislik', label: 'Kışlık Arpa', fiyat: 11.075 },
    { value: 'yazlik', label: 'Yazlık Arpa', fiyat: 11.075 }
  ];

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

  const mevcutCesitler = urunTipi === 'bugday' ? bugdayCesitleri : arpaCesitleri;
  const mevcutIlaclar = urunTipi === 'bugday' ? bugdayIlaclari : arpaIlaclari;

  const gubreEkle = () => {
    setGubreler([...gubreler, { tip: '', tlFiyati: '', miktar: '', birim: 'ton' }]);
  };

  const gubreSil = (index) => {
    setGubreler(gubreler.filter((_, i) => i !== index));
  };

  const gubreGuncelle = (index, field, value) => {
    const yeniGubreler = [...gubreler];
    yeniGubreler[index][field] = value;
    
    // Gübre tipi seçildiğinde otomatik fiyat doldur
    if (field === 'tip') {
      const secilenGubre = gubreTipleri.find(g => g.value === value);
      if (secilenGubre) {
        const ortalama = (secilenGubre.minFiyat + secilenGubre.maxFiyat) / 2;
        const tlFiyat = ortalama * dolarKuru;
        yeniGubreler[index]['tlFiyati'] = tlFiyat.toFixed(2);
      }
    }
    
    setGubreler(yeniGubreler);
  };

  const ilacEkle = () => {
    setIlaclar([...ilaclar, { adi: '', tlFiyati: '', miktar: '', birim: 'litre' }]);
  };

  const ilacSil = (index) => {
    setIlaclar(ilaclar.filter((_, i) => i !== index));
  };

  const ilacGuncelle = (index, field, value) => {
    const yeniIlaclar = [...ilaclar];
    yeniIlaclar[index][field] = value;
    
    // İlaç seçildiğinde otomatik fiyat doldur
    if (field === 'adi') {
      const secilenIlac = mevcutIlaclar.find(i => i.value === value);
      if (secilenIlac) {
        const ortalama = (secilenIlac.minFiyat + secilenIlac.maxFiyat) / 2;
        const tlFiyat = ortalama * dolarKuru;
        yeniIlaclar[index]['tlFiyati'] = tlFiyat.toFixed(2);
      }
    }
    
    setIlaclar(yeniIlaclar);
  };

  const tohumCesitDegisti = (e) => {
    const secilenCesit = mevcutCesitler.find(c => c.value === e.target.value);
    setTohum({
      ...tohum,
      cesit: e.target.value,
      fiyatTL: secilenCesit ? secilenCesit.fiyat.toString() : ''
    });
  };

  const hesapla = () => {
    // Gübre Maliyeti
    const gubreMaliyeti = gubreler.reduce((toplam, gubre) => {
      if (gubre.tlFiyati && gubre.miktar) {
        const fiyat = parseFloat(gubre.tlFiyati);
        const miktar = parseFloat(gubre.miktar);
        return toplam + (fiyat * miktar);
      }
      return toplam;
    }, 0);

    // Tohum Maliyeti
    const tohumMaliyeti = tohum.fiyatTL && tohum.miktar 
      ? parseFloat(tohum.fiyatTL) * parseFloat(tohum.miktar)
      : 0;

    // İlaç Maliyeti
    const ilacMaliyeti = ilaclar.reduce((toplam, ilac) => {
      if (ilac.tlFiyati && ilac.miktar) {
        const fiyat = parseFloat(ilac.tlFiyati);
        const miktar = parseFloat(ilac.miktar);
        // İlaçlar ton fiyatı olarak girildiği için litre olarak hesaplanırsa 1000'e bölünür
        const birimCarpan = ilac.birim === 'litre' ? 0.001 : 1;
        return toplam + (fiyat * miktar * birimCarpan);
      }
      return toplam;
    }, 0);

    // Su Masrafı
    const suMaliyeti = suMasrafi ? parseFloat(suMasrafi) : 0;

    // Toplam Maliyet
    const toplamMaliyet = gubreMaliyeti + tohumMaliyeti + ilacMaliyeti + suMaliyeti;

    return {
      gubreMaliyeti,
      tohumMaliyeti,
      ilacMaliyeti,
      suMaliyeti,
      toplamMaliyet
    };
  };

  const kaydet = async () => {
    try {
      if (!currentUser) {
        alert('Kaydedebilmek için giriş yapmalısınız!');
        return;
      }

      const hesapSonucu = hesapla();
      const db = getFirestore();
      
      await addDoc(collection(db, 'maliyetler'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        urunTipi,
        dolarKuru,
        gubre: {
          detay: gubreler,
          maliyet: hesapSonucu.gubreMaliyeti
        },
        tohum: {
          detay: tohum,
          maliyet: hesapSonucu.tohumMaliyeti
        },
        ilac: {
          detay: ilaclar,
          maliyet: hesapSonucu.ilacMaliyeti
        },
        suMasrafi: hesapSonucu.suMaliyeti,
        toplamMaliyet: hesapSonucu.toplamMaliyet,
        tarih: serverTimestamp()
      });
      
      alert('✅ Maliyet hesaplaması başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('❌ Kayıt sırasında hata oluştu: ' + error.message);
    }
  };

  const sonuc = hesapla();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">💰 Maliyet Hesaplama</h1>

      {/* Dolar Kuru */}
      <div className="bg-blue-50 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="font-semibold text-gray-700">💵 Dolar Kuru (TL):</label>
          <input
            type="number"
            step="0.01"
            value={dolarKuru}
            onChange={(e) => setDolarKuru(parseFloat(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg w-32 focus:ring-2 focus:ring-blue-500"
            disabled={kuruYukleniyor}
          />
          <span className="text-sm text-gray-600">
            {kuruYukleniyor ? '⏳ Güncelleniyor...' : `1$ = ${dolarKuru} TL`}
          </span>
          <button
            onClick={fetchDolarKuru}
            disabled={kuruYukleniyor}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition"
          >
            🔄 Yenile
          </button>
          <span className="text-xs text-gray-500">
            Otomatik API'den çekildi
          </span>
        </div>
      </div>

      {/* Ürün Tipi */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Ürün Tipi</h2>
        <select
          value={urunTipi}
          onChange={(e) => {
            setUrunTipi(e.target.value);
            setTohum({ cesit: '', fiyatTL: '', miktar: '', birim: 'kg' });
            setIlaclar([{ adi: '', tlFiyati: '', miktar: '', birim: 'litre' }]);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="bugday">🌾 Buğday</option>
          <option value="arpa">🌾 Arpa</option>
        </select>
      </div>

      {/* Gübre Bölümü */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">🌱 Gübre</h2>
          <button
            onClick={gubreEkle}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Gübre Ekle
          </button>
        </div>
        {gubreler.map((gubre, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={gubre.tip}
                onChange={(e) => gubreGuncelle(index, 'tip', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Gübre Tipi Seçin</option>
                {gubreTipleri.map(g => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={gubre.tlFiyati}
                onChange={(e) => gubreGuncelle(index, 'tlFiyati', e.target.value)}
                placeholder="Fiyat (TL)"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                value={gubre.miktar}
                onChange={(e) => gubreGuncelle(index, 'miktar', e.target.value)}
                placeholder="Miktar"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2">
                <select
                  value={gubre.birim}
                  onChange={(e) => gubreGuncelle(index, 'birim', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                >
                  <option value="ton">Ton</option>
                  <option value="litre">Litre</option>
                </select>
                {gubreler.length > 1 && (
                  <button
                    onClick={() => gubreSil(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            {gubre.tlFiyati && gubre.miktar && (
              <p className="text-sm text-green-600 mt-2">
                Toplam: {(parseFloat(gubre.tlFiyati) * parseFloat(gubre.miktar)).toFixed(2)} TL
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tohum Bölümü */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🌾 Tohum</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={tohum.cesit}
            onChange={tohumCesitDegisti}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Çeşit Seçin</option>
            {mevcutCesitler.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            value={tohum.fiyatTL}
            onChange={(e) => setTohum({...tohum, fiyatTL: e.target.value})}
            placeholder="Fiyat (TL/kg)"
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            step="0.01"
            value={tohum.miktar}
            onChange={(e) => setTohum({...tohum, miktar: e.target.value})}
            placeholder="Miktar (kg)"
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>
        {tohum.fiyatTL && tohum.miktar && (
          <p className="text-sm text-green-600 mt-2">
            Toplam: {(parseFloat(tohum.fiyatTL) * parseFloat(tohum.miktar)).toFixed(2)} TL
          </p>
        )}
      </div>

      {/* İlaç Bölümü */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">💊 İlaç</h2>
          <button
            onClick={ilacEkle}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            + İlaç Ekle
          </button>
        </div>
        {ilaclar.map((ilac, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={ilac.adi}
                onChange={(e) => ilacGuncelle(index, 'adi', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="">İlaç Seçin</option>
                {mevcutIlaclar.map(i => (
                  <option key={i.value} value={i.value}>
                    {i.label} (${i.minFiyat}-${i.maxFiyat}/ton)
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={ilac.tlFiyati}
                onChange={(e) => ilacGuncelle(index, 'tlFiyati', e.target.value)}
                placeholder="Fiyat (TL/ton)"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                value={ilac.miktar}
                onChange={(e) => ilacGuncelle(index, 'miktar', e.target.value)}
                placeholder="Miktar"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2">
                <select
                  value={ilac.birim}
                  onChange={(e) => ilacGuncelle(index, 'birim', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                >
                  <option value="litre">Litre</option>
                  <option value="ton">Ton</option>
                </select>
                {ilaclar.length > 1 && (
                  <button
                    onClick={() => ilacSil(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            {ilac.tlFiyati && ilac.miktar && (
              <p className="text-sm text-purple-600 mt-2">
                Toplam: {(parseFloat(ilac.tlFiyati) * parseFloat(ilac.miktar) * (ilac.birim === 'litre' ? 0.001 : 1)).toFixed(2)} TL
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Su Masrafı */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">💧 Su Masrafı</h2>
        <input
          type="number"
          step="0.01"
          value={suMasrafi}
          onChange={(e) => setSuMasrafi(e.target.value)}
          placeholder="Su Masrafı (TL)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sonuç */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-4">📊 Maliyet Özeti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm">Gübre Maliyeti</p>
            <p className="text-2xl font-bold">{sonuc.gubreMaliyeti.toFixed(2)} TL</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm">Tohum Maliyeti</p>
            <p className="text-2xl font-bold">{sonuc.tohumMaliyeti.toFixed(2)} TL</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm">İlaç Maliyeti</p>
            <p className="text-2xl font-bold">{sonuc.ilacMaliyeti.toFixed(2)} TL</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm">Su Masrafı</p>
            <p className="text-2xl font-bold">{sonuc.suMaliyeti.toFixed(2)} TL</p>
          </div>
        </div>
        <div className="mt-6 bg-white bg-opacity-30 rounded-lg p-6 text-center">
          <p className="text-lg mb-2">TOPLAM MALİYET</p>
          <p className="text-4xl font-bold">{sonuc.toplamMaliyet.toFixed(2)} TL</p>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={kaydet}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 text-lg"
      >
        💾 Hesaplamayı Kaydet
      </button>
    </div>
  );
}

export default MaliyetHesaplama;
