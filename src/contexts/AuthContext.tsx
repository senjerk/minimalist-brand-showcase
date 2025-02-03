import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { LoginFormData, RegisterFormData } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await authService.checkAuth();
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error?.isAuthError) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      setIsAuthenticated(true);
      toast({
        title: "Успешно",
        description: "Вы успешно вошли в систему",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ошибка при входе";
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      });
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      setIsAuthenticated(true);
      toast({
        title: "Успешно",
        description: "Регистрация прошла успешно",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Ошибка при регистрации";
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      toast({
        title: "Успешно",
        description: "Вы вышли из системы",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка при выходе из системы",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};