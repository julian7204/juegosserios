import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import mundosData from "../../data/mundos.json";

export default function MundoLiberado() {
  const navigate = useNavigate();
  const nivelActual = Number(localStorage.getItem("mundoActual") || 1);

  // Mundo actual guardado cuando terminó la batalla
  const mundos = mundosData.mundos;

  // Config del mundo actual
  const configMundo = useMemo(() => {
    return mundos.find((m) => m.id === nivelActual) || mundos[0];
  }, [nivelActual]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('/Img/fondoGeneral.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Estrellas (si las tienes activadas con CSS) */}
      <div className="absolute inset-0 animate-starfield opacity-40 pointer-events-none"></div>

      {/* BOTÓN SIGUIENTE */}
      <button
        onClick={() => {
  
            localStorage.setItem("mundoActual", JSON.stringify(nivelActual + 1));
            navigate("/mapaGalactico");
          }}
        className="absolute top-6 right-6 mt-80 z-20 cursor-pointer transition-transform hover:scale-110"
      >
        <img src={configMundo.botonSiguiente} className="w-60" />
      </button>

      {/* TÍTULO */}
      <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg number-font">
        ¡Planeta {configMundo.nombrePlaneta} Liberado!
      </h1>

      {/* SUBTÍTULO */}
      <p className="text-white text-xl md:text-2xl text-center mt-4 mb-10 px-4 number-font">
        Has derrotado a {configMundo.nombreJefe} y conseguido la gema.
      </p>

      {/* Gema */}
      <img
        src={configMundo.Gema}
        className="w-66 md:w-82 drop-shadow-xl animate-pulse"
        alt="Gema del mundo"
      />
    </div>
  );
}
