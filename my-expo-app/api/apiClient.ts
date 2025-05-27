import { AuthResponse } from './types';

const API_BASE_URL = 'http://192.168.42.246:5000/api'; // Replace with your actual API URL

const apiClient = {
  async request<T>(endpoint: string, method: string, body?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: await response.text(),
        status: response.status,
      };
      throw error;
    }

    return response.json() as Promise<T>;
  },

  // Helper methods
  get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, token);
  },

  post<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, 'POST', body, token);
  },
};

export default apiClient;
