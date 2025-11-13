import {apiClient} from "./apiClient";
import {CategoryForm, Category} from "@/types";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return await apiClient.get('categories');
  },

  async updateCategory(category: CategoryForm) {
    return await apiClient.put(`categories/${category.id}`, category);
  },

  async addCategory(category: CategoryForm) {
    return await apiClient.post('categories', category);
  },

  async deleteCategory(id: number) {
    return await apiClient.delete(`categories/${id}`);
  }
};
