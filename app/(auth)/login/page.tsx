"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
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
import { login } from "@/lib/api";
import {
  getAuthRole,
  getAuthToken,
  getHomePathForRole,
  setAuthSession,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getAuthToken()) {
      router.replace(getHomePathForRole(getAuthRole()));
    }
  }, [router]);

  const handleLogin = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    void (async () => {
      try {
        const response = await login({ email, password });
        setAuthSession({
          token: response.token,
          role: response.role,
          fullName: response.fullName,
        });
        router.push(getHomePathForRole(response.role));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
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
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}

              <div className="flex items-center justify-end text-sm">
                <Link href="#" className="font-medium text-slate-900 hover:underline">
                  ¿Olvide mi contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-slate-900 hover:bg-slate-800"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
