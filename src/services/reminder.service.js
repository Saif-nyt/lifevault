import { apiRequest, buildQuery } from "@/lib/api";

export const reminderService = {
  async list(params = {}) {
    const res = await apiRequest(`/reminders${buildQuery(params)}`);
    return res.data.reminders;
  },
  async create(payload) {
    const res = await apiRequest("/reminders", { method: "POST", body: payload });
    return res.data.reminder;
  },
  async update(id, payload) {
    const res = await apiRequest(`/reminders/${id}`, { method: "PATCH", body: payload });
    return res.data.reminder;
  },
  async remove(id) {
    await apiRequest(`/reminders/${id}`, { method: "DELETE" });
  },
};
