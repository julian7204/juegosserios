// main.tsx
import { StrictMode } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'

import Login from './Modulos/login/login';
import Register from './Modulos/register/register';
import SeleccionJuego from './Modulos/seleccion/SeleccionJuego';
import GenerarNiveles from './Modulos/niveles/generarNiveles';
import MapaGalactico from './Modulos/seleccionMundo/mapaGalactico';
import Mundo from './Modulos/mundo/mundo';
import Retroalimentacion from './Modulos/mundo/retroalimentacion';
import MundoLiberado from './Modulos/mundo/mundo-liberado';
import MundoFinal from './Modulos/mundo/mundoFinal';
import RetroalimentacionFinal from './Modulos/mundo/retroalimentacionFinal';
import { useEffect } from "react";
import './App.css'
import './index.css';




function App() {
  useEffect(() => {
    // Cambiar el favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'Casco.png'; 
    document.head.appendChild(link);

  
    document.title = 'Misión Multiplica';
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />               {/* Página inicial */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seleccion-juego" element={<SeleccionJuego />} />
        <Route path='/generarNiveles' element={<GenerarNiveles />} />
        <Route path='/MapaGalactico' element={<MapaGalactico />} />
        <Route path='/mundo' element={<Mundo />} />
        <Route path='/retroalimentacion' element={<Retroalimentacion />} />
        <Route path='/mundo-liberado' element={<MundoLiberado />} />
        <Route path='/mundoFinal' element={<MundoFinal />} />
        <Route path='/retroalimentacionFinal' element={<RetroalimentacionFinal />} />

      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
