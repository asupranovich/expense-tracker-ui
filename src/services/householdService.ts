import {Household} from "@/types";
import {apiClient} from "./apiClient";

export const householdService = {
  async getHousehold(): Promise<Household> {
    return await apiClient.get('household');
  },

  async enableCategory(categoryId: number) {
    await apiClient.put(`household/categories/${categoryId}`, {});
  },

  async disableCategory(categoryId: number) {
    await apiClient.delete(`household/categories/${categoryId}`);
  }
};
