import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactNode } from "react";

// UPGRADE 1: Strictly REMOVED "use client". 
// This must be a Server Component to keep the application fast and SEO/Server-friendly.

export default function DashboardGroupLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // FUTURE NOTE (Phase 2): 
  // Do NOT add client-side Auth Guards here. 
  // We will create a root `middleware.ts` file later that will intercept requests 
  // at the Edge network and redirect to `/login` BEFORE the page even renders.
  
  return <DashboardLayout>{children}</DashboardLayout>;
}