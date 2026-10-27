import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";

// Extiende la interfaz global Window para añadir propiedades de audio
declare global {
  interface Window {
    backgroundAudio?: HTMLAudioElement;
    backgroundAudioStarted?: boolean;
  }
}

// Tipos para las animaciones de bola de energía
type BolaEnergiaTarget = 'jugador' | 'enemigo' | null;

export default function Mundo() {
  const navigate = useNavigate();
  // --- Estado para el juego ---
  const [aciertos, setAciertos] = useState<any[]>([]);
  const [errores, setErrores] = useState<any[]>([]);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [respuesta, setRespuesta] = useState("");

  // --- Recuperación de datos de LocalStorage ---
  const juegoSeleccionado = useMemo(() => {
    return JSON.parse(localStorage.getItem("juegoSeleccionado") || "{}");
  }, []);

  const nivelActual = useMemo(() => {
    return Number(localStorage.getItem("mundoActual") || 1);
  }, []);

  const mundos = mundosData.mundos;

  // Configuración gráfica del mundo actual
  const configMundo = useMemo(() => {
    return mundos.find((m) => m.id === nivelActual) || mundos[0];
  }, [nivelActual, mundos]);

  // Preguntas para el nivel actual
  const niveles = juegoSeleccionado.mundos || [];
  const nivelJuego = niveles.find((n: any) => n.mundo === nivelActual);
  const preguntas = nivelJuego?.preguntas || [];
  const pregunta = preguntas[preguntaIndex];

  // --- Estado para las vidas ---
  const [vidaJugador, setVidaJugador] = useState(configMundo.vidaTomi);
  const [vidaEnemigo, setVidaEnemigo] = useState(configMundo.vidaJefe);

  // --- Estado para las animaciones ---
  const [hitJugador, setHitJugador] = useState(false);
  const [hitEnemigo, setHitEnemigo] = useState(false);
  const [laserJugador, setLaserJugador] = useState(false);
  const [laserEnemigo, setLaserEnemigo] = useState(false);
  const [bolaEnergiaCargando, setBolaEnergiaCargando] = useState<BolaEnergiaTarget>(null);
  const [bolaEnergiaImpacto, setBolaEnergiaImpacto] = useState<BolaEnergiaTarget>(null);

  /**
   * Efecto para guardar el progreso del mundo (solo una vez) al cargar.
   */
  useEffect(() => {
    const progreso = JSON.parse(localStorage.getItem("progresoMundos") || "{}");
    progreso[nivelActual] = true;
    localStorage.setItem("progresoMundos", JSON.stringify(progreso));
    // Sincroniza las vidas al inicio
    setVidaJugador(configMundo.vidaTomi);
    setVidaEnemigo(configMundo.vidaJefe);
  }, [nivelActual, configMundo]);

  /**
   * Lógica para validar la respuesta del usuario y gestionar las animaciones de ataque.
   */
  const responder = () => {
    if (!pregunta) return;

    const respuestaNumerica = Number(respuesta.trim());
    const esCorrecto = respuestaNumerica === pregunta.resultado;

    // Usar el mismo audio de disparo para ambos (ajusta las rutas si tienes audios distintos)
    const disparoAudio = new Audio(esCorrecto ? 'musica/disparo.mp3' : 'musica/disparo.mp3');

    if (esCorrecto) {
      setAciertos(prev => [...prev, pregunta]);
      setBolaEnergiaCargando('jugador'); // Carga la energía del jugador

      // Secuencia de ataque del jugador
      setTimeout(() => {
        setBolaEnergiaCargando(null);
        setLaserJugador(true); // Disparo de láser

        disparoAudio.play().catch(err => console.error("Error al reproducir audio:", err));

        setTimeout(() => {
          setBolaEnergiaImpacto('enemigo'); // Impacto en el enemigo

          setTimeout(() => {
            setHitEnemigo(true); // Animación de golpe en el enemigo
            setVidaEnemigo(v => Math.max(0, v - 1)); // Reduce la vida del enemigo
            setBolaEnergiaImpacto(null);

            setTimeout(() => {
              setHitEnemigo(false);
              setLaserJugador(false);
            }, 300);
          }, 200);
        }, 400);
      }, 600);

      // Pasar a la siguiente pregunta después de un tiempo
      setTimeout(() => {
        if (preguntaIndex < preguntas.length - 1) {
          setPreguntaIndex(preguntaIndex + 1);
        }
      }, 1500);

    } else { // Respuesta incorrecta: el enemigo ataca
      setErrores(prev => [...prev, pregunta]);
      setBolaEnergiaCargando('enemigo'); // Carga la energía del enemigo

      // Secuencia de ataque del enemigo
      setTimeout(() => {
        setBolaEnergiaCargando(null);
        setLaserEnemigo(true); // Disparo de láser

        disparoAudio.play().catch(err => console.error("Error al reproducir audio:", err));

        setTimeout(() => {
          setBolaEnergiaImpacto('jugador'); // Impacto en el jugador

          setTimeout(() => {
            setHitJugador(true); // Animación de golpe en el jugador
            setVidaJugador(v => Math.max(0, v - 1)); // Reduce la vida del jugador
            setBolaEnergiaImpacto(null);

            setTimeout(() => {
              setHitJugador(false);
              setLaserEnemigo(false);
            }, 300);
          }, 200);
        }, 400);
      }, 600);
    }

    setRespuesta(""); // Limpiar el input
  };

  /**
   * Efecto para detectar victoria o derrota.
   */
  useEffect(() => {
    if (vidaEnemigo <= 0) {
      // --- VICTORIA ---
      const progreso = JSON.parse(localStorage.getItem("progresoMundos") || "{}");

      // Desbloquea el siguiente mundo normal
      progreso[nivelActual + 1] = true;

      // Lógica especial para el nivel final (11)
      if (nivelActual === 11) {
        progreso.portalFinal = true;
        localStorage.setItem("mundoActual", "11");
      }

      localStorage.setItem("progresoMundos", JSON.stringify(progreso));

      // Guardar retroalimentación para la siguiente pantalla
      localStorage.setItem("retroAciertos", JSON.stringify(aciertos));
      localStorage.setItem("retroErrores", JSON.stringify(errores));

      navigate("/retroalimentacion");
    }

    if (vidaJugador <= 0) {
      // --- DERROTA ---
      const progreso = JSON.parse(localStorage.getItem("progresoMundos") || "{}");
      localStorage.setItem("progresoMundos", JSON.stringify(progreso));
      localStorage.setItem("retroAciertos", JSON.stringify(aciertos));
      localStorage.setItem("retroErrores", JSON.stringify(errores));
      navigate("/retroalimentacion");
    }
  }, [vidaJugador, vidaEnemigo, nivelActual, aciertos, errores, navigate]);


  /**
   * Efecto para manejar la reproducción de la música de fondo al primer click.
   */
  useEffect(() => {
    if (!window.backgroundAudio) {
      window.backgroundAudio = new Audio('musica/pelea.ogg');
      window.backgroundAudio.loop = true;
      window.backgroundAudio.volume = 0.5;
      window.backgroundAudioStarted = false;
    }

    const audio = window.backgroundAudio;

    const handleClick = () => {
      if (!window.backgroundAudioStarted) {
        audio.play()
          .then(() => {
            console.log("🎵 Música iniciada");
            window.backgroundAudioStarted = true;
          })
          .catch(err => console.error("❌ Error al iniciar audio:", err));
      }
    };

    // Inicia la reproducción al primer clic en cualquier parte del documento
    document.addEventListener("click", handleClick, { once: true });

    return () => {
      // Limpia el listener al desmontar
      document.removeEventListener("click", handleClick);
    };
  }, []); // Se ejecuta una sola vez al montar

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center grid grid-cols-3 items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${configMundo.fondo})` }} // Interpolación de string corregida
    >
      {/* Botón regresar */}
      <button
        onClick={() => {
          // Detener y resetear la música antes de navegar
          if (window.backgroundAudio) {
            window.backgroundAudio.pause();
            window.backgroundAudio.currentTime = 0;
            window.backgroundAudioStarted = false;
          }
          navigate("/mapaGalactico");

        }}
        className="absolute top-6 left-6"
      >
        <img src={configMundo.botonRegresar} className="w-60" />
      </button>


      {/* --- ANIMACIONES DE ATAQUE --- */}

      {/* LÁSER DEL JUGADOR */}
      {laserJugador && (
        <div className="laser-beam laser-jugador">
          <div className="laser-core"></div>
          <div className="laser-glow"></div>
          <div className="laser-particles"></div>
        </div>
      )}

      {/* LÁSER DEL ENEMIGO */}
      {laserEnemigo && (
        <div className="laser-beam laser-enemigo">
          <div className="laser-core"></div>
          <div className="laser-glow"></div>
          <div className="laser-particles"></div>
        </div>
      )}

      {/* BOLAS DE ENERGÍA (Cargando) */}
      {bolaEnergiaCargando === 'jugador' && (
        <div className="bola-energia bola-carga-jugador">
          <div className="bola-nucleo bola-azul"></div>
          <div className="bola-resplandor bola-azul"></div>
          <div className="bola-anillo bola-azul"></div>
        </div>
      )}

      {bolaEnergiaCargando === 'enemigo' && (
        <div className="bola-energia bola-carga-enemigo">
          <div className="bola-nucleo bola-roja"></div>
          <div className="bola-resplandor bola-roja"></div>
          <div className="bola-anillo bola-roja"></div>
        </div>
      )}

      {/* BOLAS DE ENERGÍA (Impacto) */}
      {bolaEnergiaImpacto === 'jugador' && (
        <div className="bola-energia bola-impacto-jugador">
          <div className="bola-nucleo bola-roja"></div>
          <div className="bola-resplandor bola-roja"></div>
          <div className="explosion-ondas bola-roja"></div>
        </div>
      )}

      {bolaEnergiaImpacto === 'enemigo' && (
        <div className="bola-energia bola-impacto-enemigo">
          <div className="bola-nucleo bola-azul"></div>
          <div className="bola-resplandor bola-azul"></div>
          <div className="explosion-ondas bola-azul"></div>
        </div>
      )}

      {/* --- COLUMNA 1: JUGADOR --- */}
      <div className="flex flex-col items-center justify-center mb-21 relative z-10">
        <img
          src="Img/personajeLado.png"
          className={`w-30 transition-all ${hitJugador ? "animate-stun-hit brightness-50" : ""} ${bolaEnergiaCargando === 'jugador' ? "brightness-150 scale-105" : ""}`} // Interpolación de string corregida
        />
        <div className="w-40 h-6 bg-red-800 rounded-full mt-4">
          <div
            className="h-6 bg-green-500 rounded-full transition-all"
            style={{
              width: `${(vidaJugador / configMundo.vidaTomi) * 100}%`, // Interpolación de string corregida
            }}
          />
        </div>
      </div>

      {/* --- COLUMNA 2: PREGUNTA Y RESPUESTA --- */}
      <div className="flex flex-col items-center justify-center relative z-10">
        {pregunta && (
          <>
            <div
              className="text-white text-4xl font-bold px-12 py-4 rounded-3xl mb-6 text-center"
              style={{ backgroundColor: configMundo.colorSecundario }}
            >
              {pregunta.numero1} &times; {pregunta.numero2} = {/* Usado &times; para mejor visualización */}
            </div>

            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && responder()}
              className="w-64 text-center text-3xl py-4 rounded-3xl mb-6"
              style={{ backgroundColor: configMundo.colorPrimario }}
              placeholder="Respuesta"
            />

            <button
              onClick={responder}
              className="text-white px-10 py-4 text-2xl rounded-3xl"
              style={{
                backgroundColor: configMundo.colorSecundario,
                border: `4px solid ${configMundo.colorPrimario}`, // Interpolación de string corregida
              }}
            >
              ¡Responder!
            </button>
          </>
        )}
      </div>

      {/* --- COLUMNA 3: JEFE --- */}
      <div className="flex flex-col items-center justify-center relative z-10">
        <img
          src={configMundo.jefeImg}
          className={`w-40 transition-all ${hitEnemigo ? "animate-stun-hit-enemigo brightness-50" : ""} ${bolaEnergiaCargando === 'enemigo' ? "brightness-150 scale-105" : ""}`} // Interpolación de string corregida
        />
        <div className="w-40 h-6 bg-red-800 rounded-full mt-4">
          <div
            className="h-6 bg-green-500 rounded-full transition-all"
            style={{
              width: `${(vidaEnemigo / configMundo.vidaJefe) * 100}%`, // Interpolación de string corregida
            }}
          />
        </div>
      </div>
    </div>
  );
}