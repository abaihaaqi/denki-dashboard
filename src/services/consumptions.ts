import api from "../lib/axios";
import { Consumption } from "../types/consumption";

export const consumptionService = {
  async getConsumptions(): Promise<Consumption[]> {
    const response = await api.get("/consumption/get-all");
    return response.data;
  },

  async reset(): Promise<void> {
    await api.delete(`/consumption/reset`);
  },
};
