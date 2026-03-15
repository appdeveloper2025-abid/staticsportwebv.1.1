import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, logout as logoutUser, login as loginUser, setupStorageListener } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for storage changes across tabs
    setupStorageListener((e) => {
      if (e.key === 'sms_current_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    });
  }, []);

  const login = (emailOrPhone, password) => {
    const result = loginUser(emailOrPhone, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateCurrentUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
