import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AnaSayfa from './pages/AnaSayfa';
import MaliyetHesaplama from './pages/MaliyetHesaplama';
import GubreBorsasi from './pages/GubreBorsasi';
import TohumBorsasi from './pages/TohumBorsasi';
import IlacBorsasi from './pages/IlacBorsasi';
import Haberler from './pages/Haberler';
import AkaryakitFiyatlari from './pages/AkaryakitFiyatlari';
import ParselSorgulama from './pages/ParselSorgulama';
import GecmisIslemler from './pages/GecmisIslemler';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<AnaSayfa />} />
                    <Route path="/maliyet-hesaplama" element={<MaliyetHesaplama />} />
                    <Route path="/gubre-borsasi" element={<GubreBorsasi />} />
                    <Route path="/tohum-borsasi" element={<TohumBorsasi />} />
                    <Route path="/ilac-borsasi" element={<IlacBorsasi />} />
                    <Route path="/haberler" element={<Haberler />} />
                    <Route path="/akaryakit-fiyatlari" element={<AkaryakitFiyatlari />} />
                    <Route path="/parsel-sorgulama" element={<ParselSorgulama />} />
                    <Route path="/gecmis-islemler" element={<GecmisIslemler />} />
                  </Routes>
                </>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
