// src/hooks/useUserStorage.ts

export function useUserStorage() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.uid || "anon";
  
    // Leer un valor con prefijo usuario
    const getItem = (key: string) => {
      const fullKey = `${key}_${userId}`;
      const value = localStorage.getItem(fullKey);
      return value ? JSON.parse(value) : null;
    };
  
    // Guardar un valor con prefijo usuario
    const setItem = (key: string, value: any) => {
      const fullKey = `${key}_${userId}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
    };
  
    // Eliminar un valor específico
    const removeItem = (key: string) => {
      const fullKey = `${key}_${userId}`;
      localStorage.removeItem(fullKey);
    };
  
    return { getItem, setItem, removeItem, userId };
  }
  