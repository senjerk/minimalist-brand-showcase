import { API_CONFIG } from '@/config/api';
import { LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';

const getCsrfToken = (): string | null => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const handleResponse = async (response: Response): Promise<AuthResponse> => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      throw { ...data, isAuthError: true };
    }
    throw data;
  }
  return data;
};

export const authService = {
  async register(formData: RegisterFormData): Promise<AuthResponse> {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async login(formData: LoginFormData): Promise<AuthResponse> {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async logout(): Promise<AuthResponse> {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async checkAuth(): Promise<AuthResponse> {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.isAuth}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken || '',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },
};