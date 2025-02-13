
import axios from "axios";
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/config/api';
import { LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
});

api.interceptors.request.use(
  async (config) => {
    let csrf_token = Cookies.get('csrftoken');
    if (!csrf_token) {
      try {
        await axios.get('http://127.0.0.1:8000/api/get-csrf-token/', { 
          withCredentials: true 
        });
        csrf_token = Cookies.get('csrftoken');
        if (csrf_token && config.headers) {
          config.headers['X-CSRFToken'] = csrf_token;
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        return Promise.reject(error);
      }
    } else if (config.headers) {
      config.headers['X-CSRFToken'] = csrf_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response && error.response.status === 403) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const handleResponse = async (response: any): Promise<AuthResponse> => {
  if (response.data) {
    return response.data;
  }
  throw response;
};

export const authService = {
  async register(formData: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await api.post('users/register/', formData);
      return handleResponse(response);
    } catch (error: any) {
      if (error.response?.data) {
        throw { ...error.response.data, isAuthError: error.response.status === 401 };
      }
      throw error;
    }
  },

  async login(formData: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await api.post('users/login/', formData);
      return handleResponse(response);
    } catch (error: any) {
      if (error.response?.data) {
        throw { ...error.response.data, isAuthError: error.response.status === 401 };
      }
      throw error;
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      const response = await api.post('users/logout/');
      return handleResponse(response);
    } catch (error: any) {
      if (error.response?.data) {
        throw { ...error.response.data, isAuthError: error.response.status === 401 };
      }
      throw error;
    }
  },

  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await api.post('users/is_auth/');
      return handleResponse(response);
    } catch (error: any) {
      if (error.response?.data) {
        throw { ...error.response.data, isAuthError: error.response.status === 401 };
      }
      throw error;
    }
  },
};
