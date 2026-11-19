import { createAuthClient } from "better-auth/react";

// No baseURL: it uses the current site, and the rewrite below sends /api/auth/* to your server
export const authClient = createAuthClient();

export function dashboardPath(role?: string | null) {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
}