import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock login
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ name: 'سارة محمد', email, initial: 'س' });
        resolve(true);
      }, 1500);
    });
  };

  const register = (data) => {
    // Mock register
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ name: data.name, email: data.email, initial: data.name.charAt(0) });
        resolve(true);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
