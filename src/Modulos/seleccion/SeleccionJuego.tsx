// src/Modulos/seleccion/SeleccionJuego.tsx

import { useState, useEffect } from "react";
import { obtenerTodosLosJuegos } from "../../services/nivelesService";
import { useNavigate, Link } from "react-router-dom";

declare global {
  interface Window {
    backgroundAudio?: HTMLAudioElement;
    backgroundAudioStarted?: boolean;
  }
}

export default function SeleccionJuego() {
  const navigate = useNavigate();

  const [juegos, setJuegos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [index, setIndex] = useState(0);

  const [videoVisible, setVideoVisible] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);
  const [imagenActual, setImagenActual] = useState(1);

  const totalImagenes = 6;

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const esProfesor = user.esProfesor === true;

  // Cargar juegos
  useEffect(() => {
    async function cargar() {
      try {
        const juegosBD = await obtenerTodosLosJuegos();
        setJuegos(juegosBD);
      } catch (err) {
        console.error("Error al obtener juegos:", err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  // -------------------------
  // EVENTOS
  // -------------------------

  const abrirVideo = () => {

    if (window.backgroundAudio) {
      window.backgroundAudio.pause();
      window.backgroundAudio.currentTime = 0;
      window.backgroundAudioStarted = false;
    }

    setVideoVisible(true);

    const juegoActual = juegos[index];
    localStorage.setItem("juegoSeleccionado", JSON.stringify(juegoActual));
  };

  const cerrarVideo = () => {
    setVideoVisible(false);
    setMostrarInstrucciones(true);
    setImagenActual(1);
  };

  const anteriorImagen = () => {
    if (imagenActual > 1) setImagenActual(imagenActual - 1);
  };

  const siguienteJuego = () => {
    if (index < juegos.length - 1) setIndex(index + 1);
  };

  const anteriorJuego = () => {
    if (index > 0) setIndex(index - 1);
  };

  const imagenesInstrucciones = [
    "/Img/instrucciones/pantallaInstrucciones 1.png",
    "/Img/instrucciones/pantallaInstrucciones 2.png",
    "/Img/instrucciones/pantallaInstrucciones 3.png",
    "/Img/instrucciones/pantallaInstrucciones 4.png",
    "/Img/instrucciones/pantallaInstrucciones 5.png",
    "/Img/instrucciones/pantallaInstrucciones 6.png",
  ];

  // -------------------------
  // RENDER
  // -------------------------

  if (cargando) {
    return (
      <div className="text-white text-center mt-20 text-2xl">
        Cargando partidas...
      </div>
    );
  }

  if (juegos.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: "url('/Img/fondoGeneral.png')" }}
      >
        <h2 className="text-3xl mb-6">No existen juegos disponibles.</h2>

        {esProfesor && (
          <Link to="/generarNiveles">
            <button className="px-6 py-3 bg-blue-500 rounded-lg text-white">
              Crear mi primer juego
            </button>
          </Link>
        )}
      </div>
    );
  }

  const juegoActual = juegos[index];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Img/fondoGeneral.png')" }}
    >
      <div className="absolute inset-0 animate-starfield opacity-50"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl text-white font-bold tracking-widest text-center pt-10 number-font">
          SELECCIONA TU JUEGO
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 -ml-36 z-20 cursor-pointer transition-transform hover:scale-110"
        >
          <img src="/Img/botones/generales/botRegresar_Gen.png" className="w-60" />
        </button>

        <div className="flex justify-center mt-6">
          <img src="/Img/personajeFeliz.png" className="w-28 md:w-40 animate-bounce" />
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 mt-12">

          <button onClick={anteriorJuego} disabled={index === 0}>
            <img
              src="/Img/botones/generales/botRegresar_Gen.png"
              className={`w-20 md:w-60 ${index === 0 ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                }`}
            />
          </button>

          <div
            onClick={abrirVideo}
            className="w-80 h-64 bg-[#2f2c7e] rounded-3xl border-8 border-[#31a8e0] shadow-xl p-8 cursor-pointer hover:scale-105 transition-all text-center"
          >
            <p className="text-white font-bold text-2xl number-font">
              {juegoActual.nombreJuego}
            </p>

            <p className="text-blue-200 mt-3 text-lg number-font">
              Creador: {juegoActual.nombreCreador}
            </p>

            <p className="text-blue-300 mt-2 text-sm number-font">
              {juegoActual.fecha?.toDate
                ? juegoActual.fecha.toDate().toLocaleDateString()
                : ""}
            </p>
          </div>

          <button
            onClick={siguienteJuego}
            disabled={index === juegos.length - 1}
          >
            <img
              src="/Img/botones/generales/botSeguir_Gen.png"
              className={`w-20 md:w-60 ${index === juegos.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                }`}
            />
          </button>
        </div>

        {esProfesor && (
          <Link to="/generarNiveles">
            <button className="absolute right-1 p-2 mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-500 hover:to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all number-font">
              Generar mundo
            </button>
          </Link>
        )}
      </div>

      {/* VIDEO */}
      {videoVisible && (
        <div className="fixed inset-0 bg-black z-[999] flex items-center justify-center">

          <button
            onClick={cerrarVideo}
            className="absolute bottom-6 left-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Saltar
          </button>

          <video
            src="../Img/video/Intro_MisionMultiplica.mp4"
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-cover pointer-events-none"
            onEnded={cerrarVideo}
          />
        </div>
      )}

      {/* INSTRUCCIONES */}
      {mostrarInstrucciones && (
        <div className="fixed inset-0 bg-black z-[999] flex items-center justify-center ">
          <img
            src={imagenesInstrucciones[imagenActual - 1]}
            className="w-full h-full object-contain"
          />

          <button
            onClick={anteriorImagen}
            disabled={imagenActual === 1}
            className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 ${imagenActual === 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:scale-110"
              }`}
          >
            <img src="/Img/botones/generales/botRegresar_Gen.png" className="w-24 md:w-40" />
          </button>

          <button
            onClick={() => {
              if (imagenActual < totalImagenes) {
                setImagenActual(imagenActual + 1);
              } else {
                setMostrarInstrucciones(false);
                navigate("/mapaGalactico");
              }
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hover:scale-110"
          >
            <img src="/Img/botones/generales/botSeguir_Gen.png" className="w-24 md:w-40" />
          </button>

          <button
            onClick={() => {
              setMostrarInstrucciones(false);
              navigate("/mapaGalactico");
            }}
            className="absolute bottom-6 left-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          >
            Saltar
          </button>

        </div>
      )}

    </div>
  );
}
