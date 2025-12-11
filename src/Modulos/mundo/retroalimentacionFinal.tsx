import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";

export default function RetroalimentacionFinal() {
  const navigate = useNavigate();

  // Mundos del JSON
  const mundos = mundosData.mundos;

  // Config del mundo FINAL (id = 11)
  const configMundo = useMemo(() => {
    return mundos.find((m) => m.id === 11) || mundos[0];
  }, []);

  // Cargar datos guardados
  const aciertos = JSON.parse(localStorage.getItem("retroAciertos") || "0");
  const errores = JSON.parse(localStorage.getItem("retroErrores") || "[]");
  const victoria = JSON.parse(localStorage.getItem("retroVictoria") || "false");

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-10 px-6 relative"
      style={{
        backgroundImage: `url(${configMundo.fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Estrellas animadas */}
      <div className="absolute inset-0 animate-starfield opacity-40 pointer-events-none"></div>

      {/* Contenido */}
      <div className="relative z-10 bg-[#00000080] backdrop-blur-lg p-10 rounded-3xl border-8 shadow-2xl max-w-3xl w-full"
        style={{ borderColor: configMundo.colorSecundario }}
      >
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-6 number-font drop-shadow-lg">
          {victoria ? "¡Has ganado la batalla final!" : "Has sido derrotado..."}
        </h1>

        <h2 className="text-white text-2xl text-center mb-4 number-font drop-shadow">
          {victoria
            ? "Lograste escapar respondiendo correctamente."
            : "No lograste responder lo suficiente a tiempo."}
        </h2>

        {/* Panel de estadísticas */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: configMundo.colorPrimario }}
        >
          <p className="text-white text-xl font-bold mb-2">
            ✔ Aciertos: <span className="text-green-300">{aciertos}</span>
          </p>

          <p className="text-white text-xl font-bold mb-4">
            ✘ Errores: <span className="text-red-300">{errores.length}</span>
          </p>

          {/* Listado de errores */}
          {errores.length > 0 && (
            <div className="mt-4">
              <p className="text-white text-lg font-semibold mb-2">
                Preguntas falladas:
              </p>
              <ul className="pl-4 list-disc text-white">
                {errores.map((err: any, idx: number) => (
                  <li key={idx}>
                    {err.numero1} × {err.numero2} = {err.resultado}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Botones */}

        {victoria ? (
          <button
            onClick={() => {
              {
                if (window.backgroundAudio) {
                  window.backgroundAudio.src = "";        
                  window.backgroundAudio.load();            
                  window.backgroundAudio = undefined;
                  window.backgroundAudioStarted = false;
                }
                localStorage.clear();
                navigate("/login");
              }
            }}
            className="w-full py-4 text-2xl font-bold text-white rounded-2xl shadow-lg transition-all hover:scale-105"
            style={{
              backgroundColor: configMundo.colorSecundario,
              border: `6px solid ${configMundo.colorPrimario}`,
            }}
          >
            Volver a inicio

          </button>
        ) : (

          <button
            onClick={() => {
              if (window.backgroundAudio) {
                window.backgroundAudio.pause();
                window.backgroundAudio.currentTime = 0;
                window.backgroundAudioStarted = false;
              }
              navigate("/mapaGalactico")
            }}
            className="w-full py-4 text-2xl font-bold text-white rounded-2xl shadow-lg transition-all hover:scale-105"
            style={{
              backgroundColor: configMundo.colorSecundario,
              border: `6px solid ${configMundo.colorPrimario}`,
            }}
          >
            Volver al Mapa
          </button>
        )}
      </div>
    </div>
  );
}
