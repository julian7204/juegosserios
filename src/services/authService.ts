import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

const usuariosRef = collection(db, "usuarios");

export const registerUsuario = async (data: { username: string; password: string; edad: number; esProfesor: boolean }) => {
  const { username, password, edad, esProfesor } = data;

  // verificar si existe
  const q = query(usuariosRef, where("username", "==", username));
  const existe = await getDocs(q);

  if (!existe.empty) {
    throw new Error("El nombre de usuario ya está registrado.");
  }

  // hash
  const hashed = await bcrypt.hash(password, 10);

  // guardar
  await addDoc(usuariosRef, {
    username,
    password: hashed,
    edad,
    esProfesor
  });
};

export const loginUsuario = async (username: string, password: string) => {
  
  const q = query(usuariosRef, where("username", "==", username));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Usuario no encontrado.");
  }

  const usuario = snapshot.docs[0].data();

  const esCorrecto = await bcrypt.compare(password, usuario.password);

  if (!esCorrecto) {
    throw new Error("Contraseña incorrecta.");
  }

  return usuario;
};
