import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as directusLogin, logout as directusLogout } from '../api/directus';

const DirectusContext = createContext();

export const DirectusProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('directus_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const login = async (email, password) => {
    const success = await directusLogin(email, password);
    if (success) {
      setToken(localStorage.getItem('directus_token'));
    }
    return success;
  };

  const logout = () => {
    directusLogout();
    setToken(null);
  };

  return (
    <DirectusContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </DirectusContext.Provider>
  );
};


export const useDirectus = () => useContext(DirectusContext);
