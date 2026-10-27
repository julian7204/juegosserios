// Modulos/mundos/MapaGalactico.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";


export default function MapaGalactico() {
  const navigate = useNavigate();
  const mundos = mundosData.mundos;

  const [progreso, setProgreso] = useState<Record<string, boolean>>({});
  const [mundoActual, setMundoActual] = useState<number>(1);

  const portalFinalActivo = progreso.portalFinal === true;
  const [mostrarVideoPortal, setMostrarVideoPortal] = useState(false);


  // Detener música de fondo
  if (window.backgroundAudio) {
    window.backgroundAudio.pause();
    window.backgroundAudio.currentTime = 0;
    window.backgroundAudioStarted = false;
  }

  // Cargar progreso y mundo actual
  useEffect(() => {
    const saved = localStorage.getItem("progresoMundos");
    const actual = Number(localStorage.getItem("mundoActual") || 1);

    setMundoActual(actual);

    if (saved) {
      const parsed = JSON.parse(saved);

      // Activar portal final si todos los mundos normales (1-10) están completados
      const todosCompletados = mundos
        .filter((m) => m.id <= 11)
        .every((m) => parsed[m.id]);

      const nuevoProgreso = todosCompletados
        ? { ...parsed, portalFinal: true }
        : parsed;


      if (nuevoProgreso.portalFinal) {
        setMostrarVideoPortal(true);
      }


      setProgreso(nuevoProgreso);
      localStorage.setItem("progresoMundos", JSON.stringify(nuevoProgreso));
    } else {
      // Primer inicio → solo mundo 1 desbloqueado
      const inicial = { "1": true };
      setProgreso(inicial);
      localStorage.setItem("progresoMundos", JSON.stringify(inicial));
    }
  }, [mundos]);

  // Seleccionar un mundo
  const seleccionarMundo = (mundoId: number, estado: 'bloqueado' | 'actual' | 'completado') => {
    if (estado !== 'actual') return;

    localStorage.setItem("mundoSeleccionado", String(mundoId));
    navigate("/mundo");
  };

  // Determinar el estado de cada mundo
  const getEstadoMundo = (mundoId: number) => {
    const desbloqueado = progreso[mundoId];
    if (!desbloqueado) return "bloqueado";
    if (mundoId === mundoActual) return "actual";
    if (mundoId < mundoActual) return "completado";
    return "bloqueado";
  };

  if (mostrarVideoPortal) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative">
        
        {/* VIDEO A PANTALLA COMPLETA */}
        <video
          src="Img/video/gemasPortal.mp4"
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => setMostrarVideoPortal(false)}
        />
  
        {/* BOTÓN SALTAR */}
        <button
          onClick={() => setMostrarVideoPortal(false)}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 
                     bg-white/20 border border-white text-white rounded-xl 
                     text-2xl backdrop-blur-md hover:bg-white/40 transition-all"
        >
          Saltar
        </button>
      </div>
    );
  }
  
  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: "url('Img/fondoGeneral.png')" }}
    >
      {/* Estrellas fondo global */}
      <div className="absolute inset-0 animate-starfield opacity-40 pointer-events-none"></div>

      {/* Botón regresar */}
      <button
        onClick={() => {localStorage.clear(); navigate("/seleccion-juego")}}
        className="absolute top-6 left-6 z-20"
      >
        <img src="Img/botones/generales/botRegresar_Gen.png" className="w-60" />
      </button>

      {/* Título */}
      <h1 className="text-white text-4xl md:text-5xl font-bold text-center mt-10 z-10 number-font">
        Mapa Galáctico
      </h1>

      {/* ================================
          PORTAL FINAL
         ================================ */}
      {portalFinalActivo && (
        <div className="flex flex-col items-center justify-center h-full w-full mt-40 relative z-10">
          <div
            onClick={() => navigate("/mundoFinal")}
            className="
              cursor-pointer 
              w-[260px] h-[260px] 
              rounded-full 
              flex items-center justify-center
              animate-pulse 
              transition-transform 
              hover:scale-110 
              shadow-[0_0_40px_15px_rgba(0,200,255,0.6)]
              border-4 border-cyan-300
            "
            style={{
              backgroundImage: "url('Img/mundos/mundo11/portal.gif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <p className="text-white text-2xl mt-6 text-center drop-shadow-lg number-font">
            Portal Dimensional Activado
          </p>
          <p className="text-blue-200 text-lg mt-2 text-center drop-shadow-lg number-font">
            ¡Haz click para entrar al desafío final!
          </p>
        </div>
      )}

      {/* ================================
          MAPA NORMAL
         ================================ */}
      {!portalFinalActivo && (
        <div className="relative min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col z-10 -mt-22">
          {/* Estrellas detrás */}
          <div className="absolute inset-0 pointer-events-none animate-starfield opacity-60 -z-10"></div>

          {/* Nebulosas */}
          <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
            <div className="absolute w-[800px] h-[100px] bg-pink-500/20 blur-3xl rounded-full animate-nebulosa1"></div>
            <div className="absolute w-[800px] h-[500px] bg-purple-500/20 blur-3xl rounded-full animate-nebulosa2"></div>
            <div className="absolute w-[900px] h-[900px] bg-blue-500/10 blur-3xl rounded-full animate-nebulosa3"></div>
          </div>

          {/* Fondo galaxia */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] rounded-full 
                            bg-gradient-to-br from-purple-800/20 to-blue-500/10 blur-3xl 
                            animate-galaxy -translate-x-1/2 -translate-y-1/2">
            </div>
          </div>

          {/* Contenido central */}
          <div className="flex flex-1 justify-center items-center">
            <div className="grid grid-cols-5 gap-6 md:gap-10 text-center">
              {mundos
                .filter((mundo) => mundo.id <= 10)
                .map((mundo) => {
                  const estado = getEstadoMundo(mundo.id);

                  return (
                    <div
                      key={mundo.id}
                      onClick={() => seleccionarMundo(mundo.id, estado)}
                      className={`transition-all ${estado === 'bloqueado'
                          ? 'opacity-40 cursor-not-allowed'
                          : estado === 'actual'
                            ? 'cursor-pointer hover:scale-110 animate-pulse-slow'
                            : 'opacity-70 cursor-not-allowed'
                        }`}
                    >
                      <img
                        src={estado === 'bloqueado' ? mundo.planetaIconDesact : mundo.planetaIcon}
                        className="w-24 h-24 md:w-32 md:h-32 lg:w-59 lg:h-36 object-contain"
                      />
                      {estado === 'completado' && (
                        <div className="text-green-400 text-sm font-bold mt-2">
                          Completado ✓
                        </div>
                      )}
                      {estado === 'actual' && (
                        <div className="text-yellow-300 text-sm font-bold mt-2">
                          ▶
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
