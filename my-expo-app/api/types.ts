export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
token: string;
  user: {
    id: string;
    name: string;
    email: string;
   
  };
}

export interface ApiError {
  message: string;
  status?: number;
}