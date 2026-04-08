"use client";

import { useRouter } from "next/navigation";

import { Bell, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Panel Bancario</h2>
        <p className="text-sm text-slate-500">Gestión general del sistema</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar..." className="w-72 rounded-xl pl-9" />
        </div>

        <button className="rounded-xl border p-2 text-slate-600 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>KA</AvatarFallback>
          </Avatar>
          <div className="hidden text-sm md:block">
            <p className="font-medium text-slate-900">Nombre de usuario</p>
            <p className="text-slate-500">Acá el nombre</p>
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
