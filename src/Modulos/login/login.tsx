// src/Modulos/auth/Login.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario, usuarioInvitado } from "../../services/authService";


declare global {
  interface Window {
    backgroundAudio?: HTMLAudioElement;
    backgroundAudioStarted?: boolean;
  }
}

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Crear el audio global SOLO si no existe
    if (!window.backgroundAudio) {
      window.backgroundAudio = new Audio('musica/fondo.mp3');
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
          .catch(err => console.error("❌ Error audio:", err));
      }
    };

    document.addEventListener("click", handleClick, { once: true });

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Completa usuario y contraseña");
      return;
    }

    try {
      const userData = await loginUsuario(username, password);
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/seleccion-juego");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function entrarComoInvitado(esProfesor: boolean) {
    localStorage.setItem("userData", JSON.stringify(usuarioInvitado(esProfesor)));
    navigate("/seleccion-juego");
  }

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('Img/fondoGeneral.png')" }}
    >
      <div className="absolute inset-0 pointer-events-none animate-starfield opacity-60"></div>

      <img src="Img/login/nave.png" className="absolute animate-nave w-80 opacity-60" />

      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 number-font">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md mx-auto">
          
          <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-wider">
            Misión Multiplica
          </h1>

          <h2 className="text-xl text-center text-blue-200 mb-8">
            Inicia sesión para comenzar
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-white font-medium">Usuario</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 mt-1 rounded-lg bg-blue-950/40 text-white placeholder-blue-200 focus:outline-none"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="text-white font-medium">Contraseña</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 rounded-lg bg-blue-950/40 text-white placeholder-blue-200 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-300 text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-700 text-white"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
            <p className="text-center text-blue-200 text-sm">
              ¿Solo quieres probarlo? Entra sin cuenta:
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => entrarComoInvitado(false)}
                className="flex-1 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
              >
                Jugar como estudiante
              </button>
              <button
                type="button"
                onClick={() => entrarComoInvitado(true)}
                className="flex-1 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-white"
              >
                Entrar como profesor
              </button>
            </div>
          </div>

          <p className="text-center text-blue-200 mt-6 text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-violet-300 underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
