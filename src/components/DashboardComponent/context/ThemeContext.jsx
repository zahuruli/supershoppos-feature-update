import { useContext, createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getFromLocalstorage = () => {
  const value = localStorage.getItem("theme");
  return value || "light";
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getFromLocalstorage();
  });

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={[theme, toggle]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);
export { useTheme, ThemeProvider };
