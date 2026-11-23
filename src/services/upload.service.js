import { apiRequest } from "@/lib/api";

export const uploadService = {
  async upload(file) {
    const form = new FormData();
    form.append("file", file);
    const res = await apiRequest("/uploads", { method: "POST", body: form });
    return res.data.upload;
  },
  async remove(id) {
    await apiRequest(`/uploads/${id}`, { method: "DELETE" });
  },
};
