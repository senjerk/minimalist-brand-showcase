export interface AuthError {
  fields: {
    [key: string]: string;
  };
  form_error: string | null;
}

export interface AuthResponse {
  errors?: AuthError;
  message: string;
  data?: any;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}