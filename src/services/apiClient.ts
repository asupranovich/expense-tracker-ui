import {authService} from './authService';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = {

  async get(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, 'GET');
    return await response.json();
  },

  async post(endpoint: string, payload: any): Promise<void> {
    await this.request(endpoint, 'POST', payload);
  },

  async put(endpoint: string, payload: any): Promise<void> {
    await this.request(endpoint, 'PUT', payload);
  },

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, 'DELETE');
  },

  async request(endpoint: string, method: string, payload?: unknown): Promise<Response> {
    const token = authService.getToken();
    const requestInit: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      ...(payload ? {body: JSON.stringify(payload)} : {})
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, requestInit);
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Failed to make ${method} request to ${endpoint}`);
    }

    return response;
  }

}
