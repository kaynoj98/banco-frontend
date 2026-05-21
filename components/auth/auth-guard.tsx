"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready] = useState(() => isAuthenticated());

  useEffect(() => {
    if (!ready) {
      router.replace("/login");
    }
  }, [ready, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
