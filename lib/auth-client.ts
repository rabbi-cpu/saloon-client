import { createAuthClient } from "better-auth/react";

// No baseURL: it uses the current site, and the rewrite below sends /api/auth/* to your server
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://saloon-client-ten.vercel.app",
});

export function dashboardPath(role?: string | null) {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
}