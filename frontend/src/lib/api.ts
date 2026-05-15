import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth-storage");
  const token = stored ? JSON.parse(stored)?.state?.token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Typed API surface ──────────────────────────────────────────────────────

export const authApi = {
  register: (data: { email: string; name: string; password: string; lang_pref?: string }) =>
    api.post("/auth/register", data),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const articlesApi = {
  list: (params?: { category?: string; limit?: number; offset?: number }) =>
    api.get("/articles", { params }),
  get: (slug: string) => api.get(`/articles/${slug}`),
};

export const qaApi = {
  // Pass the current conversation history so the AI has context
  ask: (question: string, lang: string, history: ChatMessage[] = []) =>
    api.post("/qa/ask", { question, lang, history }),
};

export const donationsApi = {
  campaigns: () => api.get("/donations/campaigns"),
  getCampaign: (slug: string) => api.get(`/donations/campaigns/${slug}`),
  checkout: (data: {
    campaign_id: string;
    amount: number;
    currency?: string;
    donor_name?: string;
    donor_email?: string;
  }) => api.post("/donations/checkout", data),
};
