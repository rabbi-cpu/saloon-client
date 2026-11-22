import axios from "axios";
import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// প্রতিটি রিকোয়েস্টের আগে Better Auth সেশন থেকে টোকেন ও ইউজার ইনফো হেডারে বসাবে
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data } = await authClient.getSession();
    const token =
      data?.session?.token ||
      (data?.user as { id?: string } | undefined)?.id ||
      "";
    const email = data?.user?.email || "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (email) {
      config.headers["x-user-email"] = email;
    }
  } catch {
    // Ignore session fetch failure and let backend respond
  }
  return config;
});