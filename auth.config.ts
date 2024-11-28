import type { NextAuthConfig } from "next-auth";

/**
 * This file contains callback logic to handle
 * custom logic after login/logout
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Enrich the session object with additional user data (id, role, etc.)
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
};
