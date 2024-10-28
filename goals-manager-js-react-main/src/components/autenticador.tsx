import { createContext, useContext, useEffect, useState } from 'react';

const autenticadorContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    <autenticadorContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </autenticadorContext.Provider>
  );
};

export const useAuth = () => useContext(autenticadorContext);

import { Navigate } from 'react-router-dom';
const RotaProtegida = ({ children }: any) => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RotaProtegida;