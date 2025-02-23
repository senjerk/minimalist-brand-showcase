import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoginFormData, RegisterFormData } from '@/types/auth';
import { addCSRFToken } from '@/lib/csrf';
import { API_CONFIG } from '@/config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = API_CONFIG.baseURL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(`${API_BASE_URL}/api/users/is_auth/`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      const headers = await addCSRFToken();
      const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        throw new Error('Ошибка при разборе ответа сервера');
      }
      
      if (response.ok) {
        setIsAuthenticated(true);
        toast({
          title: "Успешно",
          description: responseData.message || "Вы успешно вошли в систему",
        });
      } else {
        const errorMessage = responseData.errors?.form_error || 
                           responseData.message || 
                           "Ошибка при входе";
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Полная ошибка:", error);
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
      const headers = await addCSRFToken();
      const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        toast({
          title: "Успешно",
          description: "Регистрация прошла успешно",
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "Ошибка при регистрации";
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorMessage,
        });
        throw new Error(errorMessage);
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
      const headers = await addCSRFToken();
      const response = await fetch(`${API_BASE_URL}/api/users/logout/`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        toast({
          title: "Успешно",
          description: "Вы вышли из системы",
        });
      } else {
        throw new Error("Ошибка при выходе из системы");
      }
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