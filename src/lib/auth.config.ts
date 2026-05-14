import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // 1. Jab user login kare, uska ID aur Plan token mein daalo
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore (Agar User model mein plan hai toh)
        token.plan = user.plan || "BASIC"; 
      }
      return token;
    },
    // 2. Token se data nikaal kar Session object mein inject karo
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;