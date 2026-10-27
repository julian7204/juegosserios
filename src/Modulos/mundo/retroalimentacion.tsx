import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";

export default function Retroalimentacion() {
  const navigate = useNavigate();

  const nivelActual = Number(localStorage.getItem("mundoActual") || 1);
  const mundos = mundosData.mundos;
  const configMundo = mundos.find(m => m.id === nivelActual) || mundos[0];

  // Cargar datos guardados
  const aciertos = JSON.parse(localStorage.getItem("retroAciertos") || "[]");
  const errores = JSON.parse(localStorage.getItem("retroErrores") || "[]");

  if (errores.length > aciertos.length) {
    localStorage.setItem("resultado", JSON.stringify("perdido"));
  } else {
    localStorage.setItem("resultado", JSON.stringify("ganado"));
  }
  return (

    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('Img/fondoGeneral.png')" }}
    >
      {/* Estrellas animadas detrás */}
      <div className="absolute inset-0 animate-starfield opacity-40 pointer-events-none"></div>

      {/* Botón siguiente */}
      <button
        onClick={() => {
          // Si el jugador perdió → regresar al mapa galáctico
          if (errores.length > aciertos.length) {
            navigate("/mapaGalactico");
          } else {
            // Si ganó → pantalla de mundo liberado
            navigate("/mundo-liberado");
          }
        }}
        className="absolute top-6 right-6"
      >
        <img
          src={configMundo.botonSiguiente}
          className="w-70 mt-80 transition-transform hover:scale-110"
        />
      </button>

      {/* TARJETA CENTRAL */}
      <div
        className="p-10 rounded-3xl shadow-2xl"
        style={{
          width: "80%",
          maxWidth: "900px",
          backgroundColor: configMundo.colorSecundario,
          border: `6px solid ${configMundo.colorPrimario}`,
        }}
      >
        <h1 className="text-white text-4xl font-bold text-center mb-8 number-font">
          {JSON.parse(localStorage.getItem("resultado") || "null") === "perdido"
            ? "Intenta de nuevo"
            : "Revisar y Practicar"}
        </h1>

        {/* Contenedor de columnas */}
        <div className="grid grid-cols-2 gap-10">

          {/* ACIERTOS */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Aciertos</h2>
            <div
              className="rounded-3xl p-4 overflow-y-auto"
              style={{
                height: "250px",
                backgroundColor: configMundo.colorPrimario,
              }}
            >
              {aciertos.length === 0 && (
                <p className="text-center text-white/60">No hubo aciertos</p>
              )}

              {aciertos.map((p: any, i: number) => (
                <p key={i} className="text-white text-xl text-center py-1">
                  {p.numero1} × {p.numero2} = {p.resultado}
                </p>
              ))}
            </div>
          </div>

          {/* ERRORES */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-4 text-center">Errores</h2>
            <div
              className="rounded-3xl p-4 overflow-y-auto"
              style={{
                height: "250px",
                backgroundColor: configMundo.colorPrimario,
              }}
            >
              {errores.length === 0 && (
                <p className="text-center text-white/60">No hubo errores</p>
              )}

              {errores.map((p: any, i: number) => (
                <p key={i} className="text-white text-xl text-center py-1">
                  {p.numero1} × {p.numero2} = {p.resultado}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
