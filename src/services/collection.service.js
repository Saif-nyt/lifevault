import { apiRequest } from "@/lib/api";

export const collectionService = {
  async list() {
    const res = await apiRequest("/collections");
    return res.data.collections;
  },
  async get(id) {
    const res = await apiRequest(`/collections/${id}`);
    return res.data.collection;
  },
  async create(payload) {
    const res = await apiRequest("/collections", { method: "POST", body: payload });
    return res.data.collection;
  },
  async update(id, payload) {
    const res = await apiRequest(`/collections/${id}`, { method: "PATCH", body: payload });
    return res.data.collection;
  },
  async remove(id) {
    await apiRequest(`/collections/${id}`, { method: "DELETE" });
  },
  async addItem(id, archiveId) {
    const res = await apiRequest(`/collections/${id}/items`, { method: "POST", body: { archiveId } });
    return res.data.collection;
  },
  async removeItem(id, archiveId) {
    const res = await apiRequest(`/collections/${id}/items/${archiveId}`, { method: "DELETE" });
    return res.data.collection;
  },
};
