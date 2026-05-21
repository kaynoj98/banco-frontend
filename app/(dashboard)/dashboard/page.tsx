"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthRole, getHomePathForRole } from "@/lib/auth";

export default function DashboardLandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getHomePathForRole(getAuthRole()));
  }, [router]);

  return null;
}