import { apiRequest } from "@/lib/api";

export const dashboardService = {
  async stats() {
    const res = await apiRequest("/dashboard/stats");
    return res.data;
  },
  async recent() {
    const res = await apiRequest("/dashboard/recent");
    return res.data.items;
  },
  async favorites() {
    const res = await apiRequest("/dashboard/favorites");
    return res.data.items;
  },
  async upcomingReminders() {
    const res = await apiRequest("/dashboard/upcoming-reminders");
    return res.data.reminders;
  },
  async rediscover() {
    const res = await apiRequest("/dashboard/rediscover");
    return res.data.items;
  },
};
