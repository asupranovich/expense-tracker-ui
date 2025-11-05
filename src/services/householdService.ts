import {Household} from "@/types";
import {apiClient} from "./apiClient";

export const householdService = {
  async getHousehold(): Promise<Household> {
    return await apiClient.get('household');
  },
};
