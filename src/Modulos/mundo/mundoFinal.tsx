import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";

declare global {
  interface Window {
    backgroundAudio?: HTMLAudioElement;
    backgroundAudioStarted?: boolean;
  }
}

export default function MundoFinal() {
  const navigate = useNavigate();

  // Tomamos el mundo 11 del JSON
  const mundos = mundosData.mundos;
  const configMundo = useMemo(() => {
    return mundos.find((m) => m.id === 11) || mundos[0];
  }, []);

  // Cargar juego seleccionado
  const juegoSeleccionado =
    JSON.parse(localStorage.getItem("juegoSeleccionado") || "{}");

  // Preguntas del nivel final
  const niveles = juegoSeleccionado.mundos || [];
  const nivelFinal = niveles.find((n: any) => n.mundo === 11);

  const preguntas = nivelFinal?.preguntas || [];

  // Estados
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const pregunta = preguntas[preguntaIndex];

  const [respuesta, setRespuesta] = useState("");

  // Objetivo del nivel final
  const TOTAL_ACIERTOS = 8;
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState<any[]>([]);

  // Tiempo
  const TIEMPO_LIMITE = 30;
  const [tiempo, setTiempo] = useState(TIEMPO_LIMITE);

  // Animaciones
  const [hitJugador, setHitJugador] = useState(false);
  const [hitEnemigo, setHitEnemigo] = useState(false);
  const [laserJugador, setLaserJugador] = useState(false);
  const [laserEnemigo, setLaserEnemigo] = useState(false);

  const [bolaEnergiaCargando, setBolaEnergiaCargando] =
    useState<"jugador" | "enemigo" | null>(null);
  const [bolaEnergiaImpacto, setBolaEnergiaImpacto] =
    useState<"jugador" | "enemigo" | null>(null);

  const [estado, setEstado] = useState<"jugando" | "ganaste" | "perdiste">(
    "jugando"
  );

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

  // Timer
  useEffect(() => {
    if (estado !== "jugando") return;
  
    if (tiempo <= 0) {
      finalizar(false); 
      return;
    }
  
    const interval = setInterval(() => setTiempo((t) => t - 1), 1000);
  
    return () => clearInterval(interval);
  }, [tiempo, estado]);

  // Validar respuesta
  const responder = () => {
    if (!pregunta || estado !== "jugando") return;

    const correcto = Number(respuesta.trim()) === pregunta.resultado;

    if (correcto) {
      setAciertos((prev) => {
        const nuevo = prev + 1;

        animacionGolpeEnemigo();

        // Ganó el nivel final
        if (nuevo >= TOTAL_ACIERTOS) {
          finalizar(true);
        }

        return nuevo;
      });
    } else {
      setErrores((prev) => [...prev, pregunta]);

      animacionGolpeJugador();
    }

    // Siguiente pregunta
    if (preguntaIndex < preguntas.length - 1) {
      setPreguntaIndex((i) => i + 1);
    }

    setRespuesta("");
  };

  const animacionGolpeJugador = () => {
    setBolaEnergiaCargando("enemigo");

    setTimeout(() => {
      setBolaEnergiaCargando(null);
      setLaserEnemigo(true);

      setTimeout(() => {
        setBolaEnergiaImpacto("jugador");

        setTimeout(() => {
          setHitJugador(true);

          setTimeout(() => {
            setHitJugador(false);
            setLaserEnemigo(false);
            setBolaEnergiaImpacto(null);
          }, 300);
        }, 250);
      }, 300);
    }, 400);
  };

  const animacionGolpeEnemigo = () => {
    setBolaEnergiaCargando("jugador");

    setTimeout(() => {
      setBolaEnergiaCargando(null);
      setLaserJugador(true);

      setTimeout(() => {
        setBolaEnergiaImpacto("enemigo");

        setTimeout(() => {
          setHitEnemigo(true);

          setTimeout(() => {
            setHitEnemigo(false);
            setLaserJugador(false);
            setBolaEnergiaImpacto(null);
          }, 300);
        }, 250);
      }, 300);
    }, 400);
  };

  // Finalizar nivel
  const finalizar = (victoria: boolean) => {
    setEstado(victoria ? "ganaste" : "perdiste");

    localStorage.setItem("retroAciertos", JSON.stringify(aciertos));
    localStorage.setItem("retroErrores", JSON.stringify(errores));
    localStorage.setItem("retroVictoria", JSON.stringify(victoria));

    setTimeout(() => {
      navigate("/retroalimentacionFinal");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center grid grid-cols-3 items-center relative overflow-hidden"
      style={{ backgroundImage: `url(${configMundo.fondo})` }}
    >
      {/* Botón regresar */}
      <button
        onClick={() => {
          if (window.backgroundAudio) {
            window.backgroundAudio.pause();
            window.backgroundAudio.currentTime = 0;
            window.backgroundAudioStarted = false;
          }        
          navigate("/mapaGalactico")}}
        className="absolute top-6 left-6"
      >
        <img src={configMundo.botonRegresar} className="w-40" />
      </button>

      {/* Timer */}
      <div
        className="absolute top-6 right-6 text-5xl font-bold px-10 py-3 rounded-2xl"
        style={{
          backgroundColor: "white",
          border: `6px solid ${configMundo.colorSecundario}`,
        }}
      >
        ⏳ {tiempo < 10 ? `0:0${tiempo}` : `0:${tiempo}`}
      </div>

      {/* ANIMACIONES */}
      {laserJugador && <div className="laser-beam laser-jugador"></div>}
      {laserEnemigo && <div className="laser-beam laser-enemigo"></div>}

      {bolaEnergiaCargando === "jugador" && (
        <div className="bola-energia bola-carga-jugador"></div>
      )}
      {bolaEnergiaCargando === "enemigo" && (
        <div className="bola-energia bola-carga-enemigo"></div>
      )}

      {bolaEnergiaImpacto === "jugador" && (
        <div className="bola-energia bola-impacto-jugador"></div>
      )}
      {bolaEnergiaImpacto === "enemigo" && (
        <div className="bola-energia bola-impacto-enemigo"></div>
      )}

      {/* --- COLUMNA 1: TOMI --- */}
      <div className="flex flex-col items-center relative z-10">
        <img
          src="Img/personajeLado.png"
          className={`w-40 ${hitJugador ? "animate-stun-hit brightness-50" : ""}`}
        />
      </div>

      {/* --- COLUMNA 2: PREGUNTA --- */}
      <div className="flex flex-col items-center relative z-10">
        {pregunta && estado === "jugando" && (
          <>
            <div
              className="text-white text-4xl font-bold px-12 py-4 rounded-3xl mb-6 text-center"
              style={{ backgroundColor: configMundo.colorSecundario }}
            >
              {pregunta.numero1} × {pregunta.numero2} =
            </div>

            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && responder()}
              className="w-64 text-center text-3xl py-4 rounded-3xl mb-6"
              style={{ backgroundColor: configMundo.colorPrimario }}
            />

            <button
          
              onClick={responder}
              className="text-white px-10 py-4 text-2xl rounded-3xl"
              style={{
                backgroundColor: configMundo.colorSecundario,
                border: `4px solid ${configMundo.colorPrimario}`,
              }}
            >
              ¡Responder!
            </button>

            <p className="text-brown-500 text-xl mt-4">
              Aciertos: {aciertos}/{TOTAL_ACIERTOS}
            </p>
          </>
        )}
      </div>

      {/* --- COLUMNA 3: JEFE FINAL --- */}
      <div className="flex flex-col items-center relative z-10">
        <img
          src={configMundo.jefeImg}
          className={`w-60 ${hitEnemigo ? "brightness-50" : ""}`}
        />
      </div>
    </div>
  );
}
