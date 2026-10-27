// src/services/authService.ts
// Modo demo: los usuarios se guardan solo en este navegador (localStorage).
// No se envían datos a ningún servidor.
import bcrypt from "bcryptjs";

const USUARIOS_KEY = "mm_usuarios";

interface Usuario {
  username: string;
  password: string;
  edad: number;
  esProfesor: boolean;
}

const leerUsuarios = (): Usuario[] =>
  JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");

export const registerUsuario = async (data: { username: string; password: string; edad: number; esProfesor: boolean }) => {
  const { username, password, edad, esProfesor } = data;
  const usuarios = leerUsuarios();

  // verificar si existe
  if (usuarios.some((u) => u.username === username)) {
    throw new Error("El nombre de usuario ya está registrado.");
  }

  // hash
  const hashed = await bcrypt.hash(password, 10);

  // guardar
  usuarios.push({ username, password: hashed, edad, esProfesor });
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
};

export const loginUsuario = async (username: string, password: string) => {
  const usuario = leerUsuarios().find((u) => u.username === username);

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  const esCorrecto = await bcrypt.compare(password, usuario.password);

  if (!esCorrecto) {
    throw new Error("Contraseña incorrecta.");
  }

  return { username: usuario.username, edad: usuario.edad, esProfesor: usuario.esProfesor };
};

// Sesión de invitado para probar el juego sin crear cuenta
export const usuarioInvitado = (esProfesor: boolean) => ({
  username: esProfesor ? "Profesor invitado" : "Estudiante invitado",
  edad: esProfesor ? 30 : 8,
  esProfesor,
});
