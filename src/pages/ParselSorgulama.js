import React, { useState } from 'react';

function ParselSorgulama() {
    const [sorguBilgileri, setSorguBilgileri] = useState({
        il: '',
        ilce: '',
        mahalle: '',
        ada: '',
        parsel: ''
    });

    const [sonuc, setSonuc] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(false);

    const iller = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
        'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
        'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
        'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
        'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
        'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
        'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
        'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
        'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ',
        'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSorguBilgileri({
            ...sorguBilgileri,
            [name]: value
        });
    };

    const handleSorgula = () => {

        if (!sorguBilgileri.il || !sorguBilgileri.ilce || !sorguBilgileri.mahalle || !sorguBilgileri.ada || !sorguBilgileri.parsel) {
            alert('⚠️ Lütfen tüm alanları doldurun!');
            return;
        }

        setYukleniyor(true);


        setTimeout(() => {
            const ornekSonuc = {
                il: sorguBilgileri.il,
                ilce: sorguBilgileri.ilce,
                mahalle: sorguBilgileri.mahalle,
                ada: sorguBilgileri.ada,
                parsel: sorguBilgileri.parsel,
                malik: 'Örnek Malik Adı',
                yuzolcumu: (Math.random() * 10000 + 1000).toFixed(2),
                nitelik: 'Tarla',
                cins: 'Arazi',
                mevkii: 'Örnek Mevkii',
                parselTuru: 'Zirai',
                tapu: {
                    cilt: Math.floor(Math.random() * 100) + 1,
                    sayfa: Math.floor(Math.random() * 500) + 1
                },
                koordinatlar: {
                    enlem: (39 + Math.random()).toFixed(6),
                    boylam: (32 + Math.random()).toFixed(6)
                }
            };

            setSonuc(ornekSonuc);
            setYukleniyor(false);
        }, 1500);
    };

    const handleTemizle = () => {
        setSorguBilgileri({
            il: '',
            ilce: '',
            mahalle: '',
            ada: '',
            parsel: ''
        });
        setSonuc(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">📍 Parsel Sorgulama Sistemi</h1>
                <p className="text-gray-600">Tarım parselinizin bilgilerini sorgulayın</p>
            </div>



            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">🔍 Parsel Bilgileri</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">İl *</label>
                        <select
                            name="il"
                            value={sorguBilgileri.il}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">İl Seçin</option>
                            {iller.map((il) => (
                                <option key={il} value={il}>{il}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">İlçe *</label>
                        <input
                            type="text"
                            name="ilce"
                            value={sorguBilgileri.ilce}
                            onChange={handleInputChange}
                            placeholder="İlçe adını girin"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mahalle/Köy *</label>
                        <input
                            type="text"
                            name="mahalle"
                            value={sorguBilgileri.mahalle}
                            onChange={handleInputChange}
                            placeholder="Mahalle/Köy adını girin"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ada No *</label>
                        <input
                            type="text"
                            name="ada"
                            value={sorguBilgileri.ada}
                            onChange={handleInputChange}
                            placeholder="Ada numarasını girin"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parsel No *</label>
                        <input
                            type="text"
                            name="parsel"
                            value={sorguBilgileri.parsel}
                            onChange={handleInputChange}
                            placeholder="Parsel numarasını girin"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSorgula}
                        disabled={yukleniyor}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                    >
                        {yukleniyor ? '⏳ Sorgulanıyor...' : '🔍 Sorgula'}
                    </button>
                    <button
                        onClick={handleTemizle}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        🗑️ Temizle
                    </button>
                </div>
            </div>


            {sonuc && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                        ✅ Parsel Bilgileri Bulundu
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                                📍 Konum Bilgileri
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">İl:</span>
                                    <span className="font-semibold">{sonuc.il}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">İlçe:</span>
                                    <span className="font-semibold">{sonuc.ilce}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mahalle/Köy:</span>
                                    <span className="font-semibold">{sonuc.mahalle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mevkii:</span>
                                    <span className="font-semibold">{sonuc.mevkii}</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                                📋 Parsel Bilgileri
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ada:</span>
                                    <span className="font-semibold">{sonuc.ada}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Parsel:</span>
                                    <span className="font-semibold">{sonuc.parsel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Yüzölçümü:</span>
                                    <span className="font-semibold">{sonuc.yuzolcumu} m²</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nitelik:</span>
                                    <span className="font-semibold">{sonuc.nitelik}</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                                👤 Malik Bilgileri
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Malik Adı:</span>
                                    <span className="font-semibold">{sonuc.malik}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cins:</span>
                                    <span className="font-semibold">{sonuc.cins}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Parsel Türü:</span>
                                    <span className="font-semibold">{sonuc.parselTuru}</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                                📜 Diğer Bilgiler
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tapu Cilt:</span>
                                    <span className="font-semibold">{sonuc.tapu.cilt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tapu Sayfa:</span>
                                    <span className="font-semibold">{sonuc.tapu.sayfa}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Koordinat (Enlem):</span>
                                    <span className="font-semibold">{sonuc.koordinatlar.enlem}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Koordinat (Boylam):</span>
                                    <span className="font-semibold">{sonuc.koordinatlar.boylam}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Uyarı:</strong> Bu bilgiler demo amaçlıdır. Resmi parsel bilgilerine e-Devlet üzerinden veya Tapu Kadastro müdürlüklerinden ulaşabilirsiniz.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParselSorgulama;
