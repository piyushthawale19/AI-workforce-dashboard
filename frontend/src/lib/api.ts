import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data.data;
  },

  register: async (email: string, password: string, role?: string) => {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      role,
    });
    return response.data.data;
  },
};

export const metricsApi = {
  getFactoryMetrics: async () => {
    const response = await api.get("/api/metrics/factory");
    return response.data.data;
  },

  getWorkerMetrics: async () => {
    const response = await api.get("/api/metrics/workers");
    return response.data.data;
  },

  getWorkstationMetrics: async () => {
    const response = await api.get("/api/metrics/workstations");
    return response.data.data;
  },
};

export const dataApi = {
  seedData: async () => {
    const response = await api.post("/api/seed");
    return response.data.data;
  },

  resetData: async () => {
    const response = await api.post("/api/admin/reset-data");
    return response.data.data;
  },
};

export default api;
