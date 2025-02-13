
import axios from "axios";
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/config/api';
import { LoginFormData, RegisterFormData, AuthResponse } from '@/types/auth';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true
});

api.interceptors.request.use(
  async (config) => {
    const csrf_token = Cookies.get('csrftoken');
    if (!csrf_token) {
      try {
        await axios.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.csrf}`, { withCredentials: true });
        config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      config.headers['X-CSRFToken'] = csrf_token;
    }
    return config;
  },
  (error) => {
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
      const response = await api.post(API_CONFIG.endpoints.auth.register, formData);
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
      const response = await api.post(API_CONFIG.endpoints.auth.login, formData);
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
      const response = await api.post(API_CONFIG.endpoints.auth.logout);
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
      const response = await api.post(API_CONFIG.endpoints.auth.isAuth);
      return handleResponse(response);
    } catch (error: any) {
      if (error.response?.data) {
        throw { ...error.response.data, isAuthError: error.response.status === 401 };
      }
      throw error;
    }
  },
};
