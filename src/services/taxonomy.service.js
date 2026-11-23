import { apiRequest } from "@/lib/api";

export const taxonomyService = {
  async categories() {
    const res = await apiRequest("/categories");
    return res.data.categories;
  },
  async createCategory(payload) {
    const res = await apiRequest("/categories", { method: "POST", body: payload });
    return res.data.category;
  },
  async updateCategory(id, payload) {
    const res = await apiRequest(`/categories/${id}`, { method: "PATCH", body: payload });
    return res.data.category;
  },
  async deleteCategory(id) {
    await apiRequest(`/categories/${id}`, { method: "DELETE" });
  },
  async tags() {
    const res = await apiRequest("/tags");
    return res.data.tags;
  },
  async createTag(name) {
    const res = await apiRequest("/tags", { method: "POST", body: { name } });
    return res.data.tag;
  },
  async deleteTag(id) {
    await apiRequest(`/tags/${id}`, { method: "DELETE" });
  },
};
