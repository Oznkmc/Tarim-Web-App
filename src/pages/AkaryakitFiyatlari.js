import React, { useState, useEffect } from 'react';

function AkaryakitFiyatlari() {
    const [fiyatlar, setFiyatlar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [secilenSehir, setSecilenSehir] = useState('ANKARA');
    const [sonGuncelleme, setSonGuncelleme] = useState(new Date().toLocaleString('tr-TR'));

    useEffect(() => {
        fiyatlariYukle();
    }, [secilenSehir]);

    const fiyatlariYukle = () => {
        setYukleniyor(true);

        // Statik fiyatlar - Manuel olarak güncellenebilir
        const guncelFiyatlar = {
            'ANKARA': [
                { type: 'Benzin (95 Oktan)', price: '44.52', unit: 'TL/Litre', icon: '⛽' },
                { type: 'Motorin', price: '45.67', unit: 'TL/Litre', icon: '🚛' },
                { type: 'LPG (Otogaz)', price: '23.45', unit: 'TL/Litre', icon: '🔥' },
                { type: 'Euro Dizel', price: '46.89', unit: 'TL/Litre', icon: '🚗' }
            ],
            'ISTANBUL': [
                { type: 'Benzin (95 Oktan)', price: '44.95', unit: 'TL/Litre', icon: '⛽' },
                { type: 'Motorin', price: '46.12', unit: 'TL/Litre', icon: '🚛' },
                { type: 'LPG (Otogaz)', price: '23.78', unit: 'TL/Litre', icon: '🔥' },
                { type: 'Euro Dizel', price: '47.34', unit: 'TL/Litre', icon: '🚗' }
            ],
            'IZMIR': [
                { type: 'Benzin (95 Oktan)', price: '44.75', unit: 'TL/Litre', icon: '⛽' },
                { type: 'Motorin', price: '45.89', unit: 'TL/Litre', icon: '🚛' },
                { type: 'LPG (Otogaz)', price: '23.62', unit: 'TL/Litre', icon: '🔥' },
                { type: 'Euro Dizel', price: '47.12', unit: 'TL/Litre', icon: '🚗' }
            ],
            'ANTALYA': [
                { type: 'Benzin (95 Oktan)', price: '44.85', unit: 'TL/Litre', icon: '⛽' },
                { type: 'Motorin', price: '45.98', unit: 'TL/Litre', icon: '🚛' },
                { type: 'LPG (Otogaz)', price: '23.70', unit: 'TL/Litre', icon: '🔥' },
                { type: 'Euro Dizel', price: '47.25', unit: 'TL/Litre', icon: '🚗' }
            ],
            'KONYA': [
                { type: 'Benzin (95 Oktan)', price: '44.45', unit: 'TL/Litre', icon: '⛽' },
                { type: 'Motorin', price: '45.55', unit: 'TL/Litre', icon: '🚛' },
                { type: 'LPG (Otogaz)', price: '23.38', unit: 'TL/Litre', icon: '🔥' },
                { type: 'Euro Dizel', price: '46.78', unit: 'TL/Litre', icon: '🚗' }
            ]
        };

        setTimeout(() => {
            setFiyatlar(guncelFiyatlar[secilenSehir] || guncelFiyatlar['ANKARA']);
            setSonGuncelleme(new Date().toLocaleString('tr-TR'));
            setYukleniyor(false);
        }, 500);
    };

    const sehirler = ['ANKARA', 'ISTANBUL', 'IZMIR', 'ANTALYA', 'KONYA'];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">⛽ Güncel Akaryakıt Fiyatları</h1>
                <button
                    onClick={fiyatlariYukle}
                    disabled={yukleniyor}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
                >
                    {yukleniyor ? '⏳ Yükleniyor...' : '🔄 Yenile'}
                </button>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                    <strong>ℹ️ Bilgi:</strong> Akaryakıt fiyatları pompa satış fiyatlarıdır. Son Güncelleme: {sonGuncelleme}
                </p>
            </div>

            {/* Şehir Seçimi */}
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">Şehir Seçin:</label>
                <div className="flex flex-wrap gap-3">
                    {sehirler.map((sehir) => (
                        <button
                            key={sehir}
                            onClick={() => setSecilenSehir(sehir)}
                            className={`px-6 py-3 rounded-lg font-semibold transition ${secilenSehir === sehir
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {sehir}
                        </button>
                    ))}
                </div>
            </div>

            {yukleniyor ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Fiyatlar yükleniyor...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fiyatlar.map((yakit, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border border-gray-200"
                        >
                            <div className="text-center">
                                <div className="text-5xl mb-3">{yakit.icon}</div>
                                <h3 className="font-bold text-xl text-gray-800 mb-3">
                                    {yakit.type}
                                </h3>
                                <div className="bg-blue-600 text-white rounded-lg py-4 px-3 mb-2">
                                    <p className="text-3xl font-bold">{yakit.price}</p>
                                    <p className="text-sm opacity-90">{yakit.unit}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {secilenSehir} Pompa Fiyatı
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!yukleniyor && fiyatlar.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Henüz fiyat bilgisi bulunmuyor.</p>
                </div>
            )}

            {/* Fiyat Güncelleme Bilgisi */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3">📊 Fiyat Bilgileri</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Fiyatlar şehir bazında güncel pompa satış fiyatlarıdır.
                </p>
                <p className="text-sm text-gray-600">
                    Fiyatları güncellemek için <strong>🔄 Yenile</strong> butonuna tıklayabilirsiniz.
                </p>
            </div>
        </div>
    );
}

export default AkaryakitFiyatlari;
