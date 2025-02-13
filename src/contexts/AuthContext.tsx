
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { LoginFormData, RegisterFormData } from '@/types/auth';

interface User {
  email?: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.checkAuth();
      if (response.data) {
        setIsAuthenticated(true);
        setUser({
          username: response.data.username || '',
          email: response.data.email
        });
      }
    } catch (error: any) {
      if (error?.isAuthError) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      if (response.data) {
        setIsAuthenticated(true);
        setUser({
          username: response.data.username || data.username,
          email: response.data.email
        });
        toast({
          title: "Успешно",
          description: "Вы успешно вошли в систему",
        });
      }
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
      const response = await authService.register(data);
      if (response.data) {
        setIsAuthenticated(true);
        setUser({
          username: data.username,
          email: data.email
        });
        toast({
          title: "Успешно",
          description: "Регистрация прошла успешно",
        });
      }
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
      setUser(null);
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
        user,
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
