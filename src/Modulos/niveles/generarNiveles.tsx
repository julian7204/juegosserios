// Modulos/niveles/generarNiveles.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { guardarJuegoCompleto } from "../../services/nivelesService";

interface Pregunta {
  id: number;
  numero1: number;
  numero2: number;
  resultado: number;
}

interface Mundo {
  mundo: number;
  preguntas: Pregunta[];
}

function GenerarNiveles() {
  const navigate = useNavigate();
  const [mundoActual, setMundoActual] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mundosGenerados, setMundosGenerados] = useState<Mundo[]>([]);
  const [nombreJuego, setNombreJuego] = useState("");
  const [mostrarModalNombre, setMostrarModalNombre] = useState(false);
  const totalMundos = 11;

  const userDataRaw = localStorage.getItem("userData");
  let nombreCreador = "usuario_default";

  if (userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      if (userData.username) {
        nombreCreador = userData.username;
      }
    } catch (e) {
      console.error("Error leyendo userData de localStorage", e);
    }
  }

  const generarPreguntas = (mundo: number) => {
    const preguntas = [];
    const numerosUsados = new Set();

    if (mundo === 11) {
      while (preguntas.length < 12) {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
        const clave = `${num1}-${num2}`;

        if (!numerosUsados.has(clave)) {
          numerosUsados.add(clave);

          preguntas.push({
            id: preguntas.length + 1,
            numero1: num1,
            numero2: num2,
            resultado: num1 * num2,
          });
        }
      }
      return preguntas;
    }

    while (preguntas.length < 10) {
      const num2 = Math.floor(Math.random() * 12) + 1;

      if (!numerosUsados.has(num2)) {
        numerosUsados.add(num2);

        preguntas.push({
          id: preguntas.length + 1,
          numero1: mundo,
          numero2: num2,
          resultado: mundo * num2,
        });
      }
    }

    return preguntas;
  };

  // 🔥 FIX IMPORTANTE → No regenerar preguntas en cada render
  const preguntas = useMemo(() => {
    return generarPreguntas(mundoActual);
  }, [mundoActual, refresh]);

  const continuarMundo = () => {
    const nuevosMundos = [...mundosGenerados, {
      mundo: mundoActual,
      preguntas: preguntas
    }];

    setMundosGenerados(nuevosMundos);

    if (mundoActual < totalMundos) {
      setMundoActual(mundoActual + 1);
      setRefresh(0);
    } else {
      setMostrarModalNombre(true);
    }
  };

  const guardarJuegoEnBD = async () => {
    if (!nombreJuego.trim()) {
      setMensaje("✗ Debes ingresar un nombre para el juego");
      return;
    }

    setGuardando(true);
    setMensaje("Guardando juego completo...");
    setMostrarModalNombre(false);

    try {
      await guardarJuegoCompleto(nombreCreador, nombreJuego, mundosGenerados);

      setMensaje(`✓ ¡Juego "${nombreJuego}" guardado exitosamente!`);

      setTimeout(() => {
        navigate('/seleccion-juego');
      }, 2000);

    } catch (error: any) {
      setMensaje("✗ Error al guardar: " + error.message);
      setGuardando(false);
    }
  };

  const regenerarNumeros = () => {
    setRefresh(refresh + 1);
    setMensaje("");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-8"
      style={{ backgroundImage: "url('Img/fondoGeneral.png')" }}
    >
      <div className="max-w-4xl mx-auto bg-[#2f2c7e]/90 rounded-3xl border-8 border-[#31a8e0] p-8">

        <h1 className="text-5xl text-white font-bold text-center mb-4">
          Mundo {mundoActual}
        </h1>
        <p className="text-2xl text-blue-300 text-center mb-4">
          {mundoActual === 11 ? "Todas las tablas (1–12)" : `Tabla del ${mundoActual}`}
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Progreso del Juego</span>
            <span>{mundoActual}/{totalMundos} mundos</span>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-violet-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(mundoActual / totalMundos) * 100}%` }}
            ></div>
          </div>
        </div>

        {mensaje && (
          <div className={`text-center mb-4 p-3 rounded-lg ${
            mensaje.includes('✓') 
              ? 'bg-green-500/20 text-green-300' 
              : mensaje.includes('Guardando')
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-red-500/20 text-red-300'
          }`}>
            {mensaje}
          </div>
        )}

        <div className="mb-6 flex gap-4 justify-center">
          <button
            onClick={regenerarNumeros}
            disabled={guardando}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-400 
                     text-white text-lg font-bold rounded-xl 
                     shadow-lg transform hover:scale-105 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generar nuevamente
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {preguntas.map((pregunta) => (
            <div
              key={pregunta.id}
              className="bg-[#1e1b5e] p-6 rounded-xl border-4 border-blue-400"
            >
              <h2 className="text-2xl text-white font-bold mb-3">
                Pregunta {pregunta.id}
              </h2>
              <div className="text-white text-3xl font-mono text-center">
                <span>{pregunta.numero1}</span>
                {" × "}
                <span>{pregunta.numero2}</span>
                {" = "}
                <span>{pregunta.resultado}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={continuarMundo}
            disabled={guardando}
            className="px-12 py-4 bg-blue-500 
                     hover:bg-blue-400 
                     text-white text-2xl font-bold rounded-xl 
                     shadow-lg transform hover:scale-105 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando 
              ? 'Guardando...'
              : mundoActual < totalMundos
                ? `Continuar Mundo ${mundoActual + 1}`
                : 'Finalizar'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/seleccion-juego')}
            disabled={guardando}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-400 
                     text-white text-lg font-semibold rounded-lg 
                     transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Volver a Selección
          </button>
        </div>
      </div>

      {mostrarModalNombre && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2f2c7e] rounded-2xl border-4 border-[#31a8e0] p-8 max-w-md w-full mx-4">
            <h2 className="text-3xl text-white font-bold text-center mb-6">
              ¡Juego Completado! 🎉
            </h2>
            <p className="text-blue-200 text-center mb-6">
              Ingresa un nombre para guardar tu juego:
            </p>
            
            <input
              type="text"
              value={nombreJuego}
              onChange={(e) => setNombreJuego(e.target.value)}
              placeholder="Ej: Tablas de Multiplicar - Básico"
              className="w-full px-4 py-3 bg-[#1e1b5e] text-white rounded-lg 
                       border-2 border-blue-400 mb-6 text-center text-lg"
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={() => setMostrarModalNombre(false)}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500
                         text-white font-bold rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={guardarJuegoEnBD}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500
                         text-white font-bold rounded-lg transition-all"
              >
                Guardar Juego
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerarNiveles;