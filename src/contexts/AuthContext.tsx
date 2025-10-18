import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../domain/entities/User';
import { AxiosAuthRepository, AuthStorage } from '../infrastructure/repositories/AxiosAuthRepository';
import { loginUseCase } from '../application/usecases/Login';
import { apiClient } from '../infrastructure/http/apiClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    try {
      const storedUser = localStorage.getItem(AuthStorage.USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const repo = new AxiosAuthRepository();
    try {
      const loginFn = loginUseCase(repo);
      const { user: loggedInUser } = await loginFn({ email, password });
      setUser(loggedInUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AuthStorage.USER_KEY);
      localStorage.removeItem(AuthStorage.TOKEN_KEY);
    } catch {
      // ignore
    }
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(AuthStorage.USER_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};