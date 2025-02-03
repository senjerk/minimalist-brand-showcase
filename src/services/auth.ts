import { API_CONFIG } from '@/config/api';
import { LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';

const handleResponse = async (response: Response): Promise<AuthResponse> => {
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const authService = {
  async register(formData: RegisterFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async login(formData: LoginFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async logout(): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async checkAuth(): Promise<AuthResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.isAuth}`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};