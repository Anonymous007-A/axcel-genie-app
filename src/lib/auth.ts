import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { PlanTier, UserRole } from "@prisma/client"; //

// ✅ Core imports for augmentation
import "next-auth";
import { JWT } from "next-auth/jwt"; // ✅ Explicit import for JWT

// ✅ Type Augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: PlanTier; //
      role: UserRole; //
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    plan: PlanTier; //
    role: UserRole; //
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: PlanTier;
    role: UserRole;
  }
}

// ✅ Main Auth Logic
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.plan = user.plan;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.role = token.role;
      }
      return session;
    },
  },
});