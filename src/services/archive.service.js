import { apiRequest, buildQuery } from "@/lib/api";

export const archiveService = {
  async list(params = {}) {
    const res = await apiRequest(`/archives${buildQuery(params)}`);
    return { items: res.data.items, meta: res.meta };
  },
  async get(id) {
    const res = await apiRequest(`/archives/${id}`);
    return res.data.archive;
  },
  async create(payload) {
    const res = await apiRequest("/archives", { method: "POST", body: payload });
    return res.data.archive;
  },
  async update(id, payload) {
    const res = await apiRequest(`/archives/${id}`, { method: "PATCH", body: payload });
    return res.data.archive;
  },
  async remove(id) {
    await apiRequest(`/archives/${id}`, { method: "DELETE" });
  },
  async toggleFavorite(id) {
    const res = await apiRequest(`/archives/${id}/favorite`, { method: "PATCH" });
    return res.data.archive;
  },
  async timeline(params = {}) {
    const res = await apiRequest(`/archives/timeline${buildQuery(params)}`);
    return res.data;
  },
};
