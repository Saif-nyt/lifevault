import { apiRequest } from "@/lib/api";

export const authService = {
  async register(payload) {
    const res = await apiRequest("/auth/register", { method: "POST", body: payload });
    return res.data.user;
  },
  async login(payload) {
    const res = await apiRequest("/auth/login", { method: "POST", body: payload });
    return res.data.user;
  },
  async googleLogin(idToken) {
    const res = await apiRequest("/auth/google", { method: "POST", body: { idToken } });
    return res.data.user;
  },
  async logout() {
    await apiRequest("/auth/logout", { method: "POST" });
  },
  async me() {
    const res = await apiRequest("/auth/me");
    return res.data.user;
  },
  async updateProfile(payload) {
    const res = await apiRequest("/auth/me", { method: "PATCH", body: payload });
    return res.data.user;
  },
  async changePassword(payload) {
    await apiRequest("/auth/password", { method: "PATCH", body: payload });
  },
};
