"use client";

import { useRouter } from "next/navigation";
import { Landmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Lado izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-300">Sistema Bancario</p>
            <h1 className="text-2xl font-bold">Banco Los Patitos</h1>
          </div>
        </div>
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Acceso seguro a su banca virtual
          </h2>
          <p className="text-slate-300">
            Administra usuarios, cuentas y transacciones desde una interfaz
            moderna, segura y profesional.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          © 2026 Banco Los Patitos. Todos los derechos reservados.
        </p>
      </div>

      {/* Lado derecho */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu banca virtual.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Recordarme
                </label>

                <Link
                  href="#"
                  className="font-medium text-slate-900 hover:underline"
                >
                  ¿Olvide mi contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-slate-900 hover:bg-slate-800"
              >
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
