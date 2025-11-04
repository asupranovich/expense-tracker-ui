import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080';

export const expenseService = {
  async getExpensesByMonth(month: string) {
    const token = authService.getToken();
    const url = new URL(`${API_BASE_URL}/expenses`);
    if (month) {
      url.searchParams.set('date', month + '-01');
    }

    const response = await fetch(url.toString(), {
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
      throw new Error('Failed to fetch expenses');
    }

    return await response.json();
  },

  async addExpense(payload: {
    payDate: string; // 'YYYY-MM-DD'
    category: object;
    payer: object;
    amount: number;
    description: string;
    remark?: string;
  }) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || 'Failed to add expense');
    }
  },

  async deleteExpense(id: number) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
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
  },

  async updateExpense(id: number, payload: {
    payDate: string;
    category: { id: number };
    payer: { id: number };
    amount: number;
    description?: string;
    remark?: string;
  }) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || 'Failed to update expense');
    }
  }
};