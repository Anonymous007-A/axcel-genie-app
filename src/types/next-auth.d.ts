import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";
import { PlanTier, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: PlanTier;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    plan: PlanTier;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: PlanTier;
    role: UserRole;
  }
}