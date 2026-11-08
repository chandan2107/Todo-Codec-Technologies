import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from server if token exists
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('taskflow_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Authentication token verification failed:', err.message);
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user: userData, token: authToken } = res.data;
      
      localStorage.setItem('taskflow_token', authToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return { success: false, message: err.message, errors: err.errors };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      const { user: userData, token: authToken } = res.data;

      localStorage.setItem('taskflow_token', authToken);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);
      showToast('Account created successfully! Welcome to TaskFlow.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Registration failed. Please check the form.', 'error');
      return { success: false, message: err.message, errors: err.errors };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    setToken(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res?.data?.user) {
        setUser((prev) => ({ ...prev, ...res.data.user }));
        localStorage.setItem('taskflow_user', JSON.stringify({ ...user, ...res.data.user }));
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Profile update failed', 'error');
      return { success: false, message: err.message, errors: err.errors };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser: loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

