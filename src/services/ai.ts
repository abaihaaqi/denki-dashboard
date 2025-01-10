import api from "../lib/axios";

export const AIService = {
  async askAnalyze(query: string) {
    const formData = new FormData();
    formData.append("query", query);

    const response = await api.post("/ai/analyze-data", formData);

    return response.data;
  },
  async chatWithAI(query: string) {
    const formData = new FormData();
    formData.append("query", query);

    const response = await api.post("/ai/chat", formData);

    return response.data;
  },
};
