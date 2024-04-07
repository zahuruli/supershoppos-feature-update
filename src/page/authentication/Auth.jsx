// auth.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(!!JSON.parse(
localStorage.getItem("x-access-token")
));

  const login = (token,roles) => {
    localStorage.setItem("x-access-token",JSON.stringify(token));
    localStorage.setItem("role", roles );
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("x-access-token");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
