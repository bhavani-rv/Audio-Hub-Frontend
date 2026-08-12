import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Temporary state for OTP flows (can hold email or username)
  const [tempIdentifier, setTempIdentifier] = useState('');

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('jwtToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginSuccess = (token, userData) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setTempIdentifier('');
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setTempIdentifier('');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      loginSuccess,
      logout,
      tempIdentifier,
      setTempIdentifier
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react/only-export-components
export const useAuth = () => useContext(AuthContext);
