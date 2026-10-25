import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Only allow same-site relative paths as post-login redirects.
export function safeCallbackUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value.includes("\\") ? "/" : value;
}
