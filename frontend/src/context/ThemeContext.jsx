import { createContext, useState, useContext, useEffect } from "react";

/**
 * Contexte pour la gestion globale du thème (clair/sombre).
 */
const ThemeContext = createContext();

/**
 * Composant fournisseur (Provider) pour ThemeContext.
 * Gère l'état du thème et persiste le choix dans le localStorage.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants à envelopper.
 */
export const ThemeProvider = ({ children }) => {
  // Initialisation du thème à partir du localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Applique la classe CSS correspondante au body et met à jour le localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  /**
   * Alterne entre le mode clair et le mode sombre.
   */
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder facilement au contexte du thème.
 * @returns {Object} L'état du thème et la fonction pour le basculer.
 */
export const useTheme = () => useContext(ThemeContext);
