import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import React from "react";

export default function DashboardLayout(props: Readonly<{ children: React.ReactNode }>) {
  const { children } = props;
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
