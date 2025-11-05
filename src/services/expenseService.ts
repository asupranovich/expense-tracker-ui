import {apiClient} from "./apiClient";
import {Expense, ExpenseForm} from "@/types";

export const expenseService = {
  async getExpensesByMonth(month: string): Promise<Expense[]> {
    return await apiClient.get(`expenses?date=${month}-01`);
  },

  async addExpense(payload: ExpenseForm) {
    await apiClient.post('expenses', payload);
  },

  async deleteExpense(id: number) {
    await apiClient.delete(`expenses/${id}`);
  },

  async updateExpense(id: number, payload: ExpenseForm) {
    await apiClient.put(`expenses/${id}`, payload);
  }
};