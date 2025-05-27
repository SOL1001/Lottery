import apiClient from './apiClient';
import { LoginCredentials, RegisterData, AuthResponse } from './types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async logout(token: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {}, token);
    } catch (error) {
      // console.warn('Logout failed:', error.message);
    }
  },
};