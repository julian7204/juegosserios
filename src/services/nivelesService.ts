// src/services/nivelesService.ts
// Modo demo: los juegos se guardan solo en este navegador (localStorage).
// Siempre existe un juego de ejemplo para que cualquiera pueda jugar.

const JUEGOS_KEY = "mm_juegos";

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
  id: string;
  nombreCreador: string;
  nombreJuego: string;
  fecha: string; // ISO
  mundos: Mundo[];
}

// Juego de ejemplo: tablas del 1 al 10 (mundos 1-10) y un mundo final mixto (11)
const crearJuegoDemo = (): Juego => {
  const mundos: Mundo[] = [];
  for (let mundo = 1; mundo <= 10; mundo++) {
    mundos.push({
      mundo,
      preguntas: [2, 5, 3, 7, 4, 9, 6, 8, 10, 1].map((n, i) => ({
        id: i + 1,
        numero1: mundo,
        numero2: n,
        resultado: mundo * n,
      })),
    });
  }
  const finales: [number, number][] = [
    [3, 4], [6, 7], [8, 9], [5, 12], [7, 8], [9, 6],
    [4, 11], [12, 3], [2, 9], [11, 5], [6, 6], [10, 12],
  ];
  mundos.push({
    mundo: 11,
    preguntas: finales.map(([a, b], i) => ({ id: i + 1, numero1: a, numero2: b, resultado: a * b })),
  });

  return {
    id: "demo",
    nombreCreador: "Misión Multiplica",
    nombreJuego: "Juego de ejemplo",
    fecha: "2025-12-11T12:00:00.000Z",
    mundos,
  };
};

const leerJuegos = (): Juego[] =>
  JSON.parse(localStorage.getItem(JUEGOS_KEY) || "[]");

/**
 * Guarda un juego completo con todos sus niveles en UN SOLO registro
 */
export const guardarJuegoCompleto = async (
  nombreCreador: string,
  nombreJuego: string,
  mundos: Mundo[]
) => {
  try {
    const juego: Juego = {
      id: crypto.randomUUID(),
      nombreCreador,
      nombreJuego,
      mundos: mundos, // mundos es un array de objetos
      fecha: new Date().toISOString(),
    };
    localStorage.setItem(JUEGOS_KEY, JSON.stringify([...leerJuegos(), juego]));
    return juego.id;
  } catch (error) {
    console.error("Error al guardar juego:", error);
    throw new Error("No se pudo guardar el juego.");
  }
};

/**
 * Obtiene todos los juegos de un creador
 */
export const obtenerJuegosPorCreador = async (nombreCreador: string) =>
  (await obtenerTodosLosJuegos()).filter((j) => j.nombreCreador === nombreCreador);

/**
 * Obtiene todos los juegos (el de ejemplo primero)
 */
export const obtenerTodosLosJuegos = async () => [crearJuegoDemo(), ...leerJuegos()];
