import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// No type augmentation here – it's in next-auth.d.ts

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;      // user exists, id is present from DB
        token.plan = user.plan!;  // plan is always present (default BASIC)
        token.role = user.role!;  // role is always present (default MEMBER)
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id!;
        session.user.plan = token.plan!;
        session.user.role = token.role!;
      }
      return session;
    },
  },
});