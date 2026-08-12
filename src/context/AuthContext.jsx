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
    
    // Explicitly set jwtToken in cookies so it is visible in DevTools
    document.cookie = `jwtToken=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    setUser(userData);
    setIsAuthenticated(true);
    setTempIdentifier('');
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    // Explicitly set all existing cookies to "null" value
    document.cookie.split(";").forEach((c) => {
      const cookieName = c.replace(/^ +/, "").split("=")[0];
      if (cookieName) {
        document.cookie = `${cookieName}=null; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/`;
      }
    });
    
    // Explicitly add jwtToken and user as null in cookies
    document.cookie = "jwtToken=null; path=/";
    document.cookie = "user=null; path=/";

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
