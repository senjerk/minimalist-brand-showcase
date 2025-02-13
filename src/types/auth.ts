
export interface AuthError {
  fields?: {
    [key: string]: string;
  };
  form_error?: string;
}

export interface AuthResponse {
  errors?: AuthError;
  message?: string;
  data?: {
    email?: string;
    username?: string;
  };
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
