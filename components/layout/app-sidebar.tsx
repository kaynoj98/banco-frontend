"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Repeat2,
  Shield,
} from "lucide-react";
import { getAuthRole } from "@/lib/auth";

const adminMenu = [
  { name: "Resumen", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Usuarios", href: "/dashboard/admin#usuarios", icon: Users },
  { name: "Cuentas", href: "/dashboard/admin#cuentas", icon: CreditCard },
  { name: "Transacciones", href: "/dashboard/admin#transacciones", icon: Receipt },
  { name: "Roles y permisos", href: "/dashboard/admin#roles-permisos", icon: Shield },
];

const clientMenu = [
  { name: "Resumen", href: "/dashboard/cliente", icon: LayoutDashboard },
  { name: "Mis cuentas", href: "/dashboard/cliente#cuentas", icon: CreditCard },
  { name: "Mis movimientos", href: "/dashboard/cliente#movimientos", icon: Receipt },
  { name: "Transferir", href: "/dashboard/cliente#transferencia", icon: Repeat2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const role = getAuthRole();
  const menu = role === "Cliente" ? clientMenu : adminMenu;

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Banca Operativa</p>
          <h1 className="text-lg font-semibold text-slate-900">Banco Los Patitos</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href.split("#")[0];

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
