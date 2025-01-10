import api from "../lib/axios";

export const uploadService = {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/consumption/upload-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
