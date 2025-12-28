import React, { useState, useEffect } from 'react';

function Haberler() {
    const [haberler, setHaberler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState(null);

    useEffect(() => {
        haberleriYukle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const haberleriYukle = async () => {
        try {
            setYukleniyor(true);
            setHata(null);

            // GNews API - Ücretsiz ve production'da çalışır
            // Kendi API key'inizi https://gnews.io/ adresinden alabilirsiniz
            const apiKey = '194b068befd7cf38488062ac34c51aff'; // Buraya kendi API key'inizi ekleyin

            // Geçici olarak, API olmadan örnek haberler gösterelim
            if (apiKey === '194b068befd7cf38488062ac34c51aff') {
                // Örnek haberler
                const ornekHaberler = [
                    {
                        title: 'Tarımda Dijital Dönüşüm Hızlanıyor',
                        description: 'Çiftçiler artık akıllı tarım teknolojilerini daha fazla kullanmaya başladı. Drone ve sensör teknolojileri verimliliği artırıyor.',
                        url: 'https://www.saraymedya.com/haber/2025-te-turkiye-tariminda-dijital-donusum-ve-su-yonetimi-on-plana-cikti_230068/',
                        urlToImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    },
                    {
                        title: 'Buğday Fiyatlarında Artış Beklentisi',
                        description: 'Küresel piyasalarda yaşanan gelişmeler nedeniyle buğday fiyatlarında artış bekleniyor.',
                        url: 'https://www.dw.com/tr/bu%C4%9Fday-fiyatlar%C4%B1-t%C3%BCrkiyeyi-nas%C4%B1l-etkileyecek/a-66386877',
                        urlToImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    },
                    {
                        title: 'Organik Tarıma İlgi Artıyor',
                        description: 'Son yıllarda organik tarım yapan çiftçi sayısında ciddi artış yaşanıyor. Tüketici talebi de yükseliyor.',
                        url: 'https://www.tarim.gov.tr',
                        urlToImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    },
                    {
                        title: 'Yeni Gübre Destekleri Açıklandı',
                        description: 'Tarım ve Orman Bakanlığı çiftçilere yönelik yeni gübre destek paketini duyurdu.',
                        url: 'https://www.tarim.gov.tr',
                        urlToImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    },
                    {
                        title: 'İklim Değişikliği ve Tarım',
                        description: 'İklim değişikliğinin tarım üzerindeki etkileri ve alınması gereken önlemler masaya yatırıldı.',
                        url: 'https://www.tarim.gov.tr',
                        urlToImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    },
                    {
                        title: 'Akıllı Sulama Sistemleri',
                        description: 'Su tasarrufu sağlayan akıllı sulama sistemleri çiftçiler tarafından tercih ediliyor.',
                        url: 'https://www.tarim.gov.tr',
                        urlToImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Tarım Platformu' }
                    }
                ];
                setHaberler(ornekHaberler);
                return;
            }

            // Gerçek API kullanımı (API key eklendiğinde aktif olacak)
            const url = `https://gnews.io/api/v4/search?q=tarım+OR+agriculture+OR+çiftçi&lang=tr&apikey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.articles) {
                setHaberler(data.articles);
            } else {
                setHata('Haberler yüklenemedi.');
            }
        } catch (error) {
            console.error('Haber yükleme hatası:', error);
            setHata('Haberler yüklenirken bir hata oluştu.');
        } finally {
            setYukleniyor(false);
        }
    };

    const formatTarih = (tarihStr) => {
        const tarih = new Date(tarihStr);
        return tarih.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">📰 Tarım Haberleri</h1>
                <button
                    onClick={haberleriYukle}
                    disabled={yukleniyor}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
                >
                    {yukleniyor ? '⏳ Yükleniyor...' : '🔄 Yenile'}
                </button>
            </div>



            {hata && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {hata}
                </div>
            )}

            {yukleniyor ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Haberler yükleniyor...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {haberler.map((haber, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                            {haber.urlToImage && (
                                <img
                                    src={haber.urlToImage}
                                    alt={haber.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                                    {haber.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                    {haber.description || 'Açıklama bulunmuyor.'}
                                </p>
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                    <span>{haber.source.name}</span>
                                    <span>{formatTarih(haber.publishedAt)}</span>
                                </div>
                                <a
                                    href={haber.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Haberi Oku →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!yukleniyor && haberler.length === 0 && !hata && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Henüz haber bulunmuyor.</p>
                </div>
            )}
        </div>
    );
}

export default Haberler;
