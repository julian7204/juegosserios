// src/Modulos/register/Register.tsx
import { useState } from "react";
import { registerUsuario } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    edad: "",
    rol: "estudiante", // estudiante por defecto
    codigoProfesor: ""
  });

  const [error, setError] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password || !form.edad) {
      setError("Completa todos los campos.");
      return;
    }

    // Validar si es profesor y si el código es correcto
    const CODIGO_PROFESOR = "PROF123"; // código estático por ahora

    if (form.rol === "profesor") {
      if (form.codigoProfesor !== CODIGO_PROFESOR) {
        setError("Código de profesor incorrecto.");
        return;
      }
    }

    try {
      await registerUsuario({
        username: form.username,
        password: form.password,
        edad: Number(form.edad),
        esProfesor: form.rol === "profesor"
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error al crear usuario.");
    }
  }

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: "url('/Img/fondoGeneral.png')" }}
    >
      <div className="absolute inset-0 animate-starfield opacity-60"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 p-8 bg-white/10 backdrop-blur-xl rounded-2xl w-full max-w-md border border-white/20 number-font">

        <h1 className="text-white text-3xl text-center mb-6 font-bold">
          Crear Cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-blue-950/40 text-white rounded-lg border border-blue-300/30"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-blue-950/40 text-white rounded-lg border border-blue-300/30"
          />

          <input
            name="edad"
            type="number"
            min={5}
            placeholder="Edad"
            value={form.edad}
            onChange={handleChange}
            className="w-32 px-4 py-3 bg-blue-950/40 text-white rounded-lg border border-blue-300/30"
          />

          {/* SELECCIÓN DE ROL */}
          <div className="text-white mt-4">
            <p className="mb-2 font-semibold">¿Eres?</p>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="rol"
                value="estudiante"
                checked={form.rol === "estudiante"}
                onChange={handleChange}
              />
              Estudiante
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="rol"
                value="profesor"
                checked={form.rol === "profesor"}
                onChange={handleChange}
              />
              Profesor
            </label>
          </div>

          {/* CAMPO DE CÓDIGO SOLO PARA PROFESOR */}
          {form.rol === "profesor" && (
            <input
              name="codigoProfesor"
              placeholder="Código de profesor"
              value={form.codigoProfesor}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-purple-900/40 text-white rounded-lg border border-purple-300/30 mt-3"
            />
          )}

          {error && (
            <p className="text-red-300 text-center font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-lg"
          >
            Registrarme
          </button>

        </form>

        <p className="text-center text-blue-200 mt-4">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-violet-300 underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
