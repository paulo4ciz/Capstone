import { createContext, useState, useEffect, useContext } from 'react';

const FontSizeContext = createContext();

export const useFontSize = () => useContext(FontSizeContext);

export function FontSizeProvider({ children }) {
  // Intentamos leer del localStorage, si no, usamos 100%
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app:fontSize');
    return saved ? parseInt(saved, 10) : 100;
  });

  useEffect(() => {
    // Aplicamos el tamaño al elemento HTML raíz
    document.documentElement.style.fontSize = `${fontSize}%`;
    // Guardamos en memoria
    localStorage.setItem('app:fontSize', fontSize);
  }, [fontSize]);

  // Límites: Mínimo 75%, Máximo 150%
  const increaseFont = () => setFontSize(prev => Math.min(prev + 10, 150));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 10, 75));
  const resetFont = () => setFontSize(100);

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFont, decreaseFont, resetFont }}>
      {children}
    </FontSizeContext.Provider>
  );
}