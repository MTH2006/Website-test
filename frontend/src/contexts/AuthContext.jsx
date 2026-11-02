import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('minicaas_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('minicaas_token');
      const storedUser = localStorage.getItem('minicaas_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await authApi.getMe();
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('minicaas_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    if (res.data && res.data.success) {
      const { token: newToken, user: newUser } = res.data.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('minicaas_token', newToken);
      localStorage.setItem('minicaas_user', JSON.stringify(newUser));
      return newUser;
    } else {
      throw new Error(res.data.message || 'Đăng nhập thất bại');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('minicaas_token');
    localStorage.removeItem('minicaas_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const namespaceScope = user?.namespaceScope || 'all';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin,
        namespaceScope,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
