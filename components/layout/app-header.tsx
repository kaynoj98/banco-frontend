"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/api";
import {
  getAuthFullName,
  getAuthRole,
  getAuthToken,
  removeAuthToken,
  setAuthSession,
} from "@/lib/auth";

export function AppHeader() {
  const router = useRouter();
  const [userName, setUserName] = useState(getAuthFullName() ?? "Usuario");
  const [role, setRole] = useState(getAuthRole() ?? "");

  useEffect(() => {
    const authToken = getAuthToken();

    if (!authToken) {
      router.replace("/login");
      return;
    }

    const token = authToken;

    async function loadUser() {
      try {
        if (getAuthFullName() && getAuthRole()) {
          return;
        }

        const user = await fetchMe();
        const fullName = `${user.firstName} ${user.lastName}`;

        setAuthSession({
          token,
          role: user.role,
          fullName,
        });
        setUserName(fullName);
        setRole(user.role);
      } catch (error) {
        console.error(error);
        removeAuthToken();
        router.replace("/login");
      }
    }

    loadUser();
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Panel Bancario</h2>
        <p className="text-sm text-slate-500">
          {role === "Cliente" ? "Vista de cliente" : "Vista de administrador"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{userName.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden text-sm md:block">
            <p className="font-medium text-slate-900">{userName}</p>
            <p className="text-slate-500">{role || "Sesión activa"}</p>
          </div>
        </div>

        <Button variant="outline" onClick={handleLogout} className="rounded-xl">
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
