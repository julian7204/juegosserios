// src/services/nivelesService.ts
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

const juegosRef = collection(db, "juegos");

// Tipos
export interface Pregunta {
  id: number;
  numero1: number;
  numero2: number;
  resultado: number;
}

export interface Mundo {
  mundo: number;
  preguntas: Pregunta[];
}

export interface Juego {
  nombreCreador: string;
  nombreJuego: string;
  fecha: Timestamp;
  mundos: Mundo[];
}

/**
 * Guarda un juego completo con todos sus niveles en UN SOLO registro
 */
export const guardarJuegoCompleto = async (
  nombreCreador: string,
  nombreJuego: string,
  mundos: Mundo[]
) => {
  try {
    const docRef = await addDoc(juegosRef, {
      nombreCreador,
      nombreJuego,
      mundos: mundos, // mundos es un array de objetos
      fecha: Timestamp.now(),
    });
    console.log("Juego completo guardado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar juego:", error);
    throw new Error("No se pudo guardar el juego en la base de datos.");
  }
};

/**
 * Obtiene todos los juegos de un creador
 */
export const obtenerJuegosPorCreador = async (nombreCreador: string) => {
  try {
    const q = query(juegosRef, where("nombreCreador", "==", nombreCreador));
    const snapshot = await getDocs(q);

    const juegos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return juegos;
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    throw new Error("No se pudieron obtener los juegos.");
  }
};

/**
 * Obtiene todos los juegos
 */
export const obtenerTodosLosJuegos = async () => {
  try {
    const snapshot = await getDocs(juegosRef);

    const juegos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return juegos;
  } catch (error) {
    console.error("Error al obtener todos los juegos:", error);
    throw new Error("No se pudieron obtener los juegos.");
  }
};
