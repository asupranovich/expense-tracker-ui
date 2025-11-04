import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080';

export type Category = {
  id: number;
  name: string;
};

export type Person = {
  id: number;
  name: string;
};

export type Household = {
  id: number;
  name: string;
  categories: Category[];
  members: Person[];
};

export const householdService = {

  async getHousehold() {
    const token = authService.getToken();

    const response = await fetch(`${API_BASE_URL}/household`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch household');
    }

    return await response.json();
  },
};
