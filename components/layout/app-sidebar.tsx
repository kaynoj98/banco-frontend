"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Usuarios", href: "/usuarios", icon: Users },
  { name: "Cuentas", href: "/cuentas", icon: CreditCard },
  { name: "Transacciones", href: "/transacciones", icon: Receipt },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Sistema Bancario</p>
          <h1 className="text-lg font-semibold text-slate-900">
            Banco Front-End
          </h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
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
