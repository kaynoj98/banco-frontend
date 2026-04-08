import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentTransactions = [
  {
    id: 1,
    type: "DEPÓSITO",
    account: "Cuenta de Ahorros - 001245",
    amount: "Q 2,500.00",
    status: "COMPLETADA",
    date: "28/03/2026",
  },
  {
    id: 2,
    type: "RETIRO",
    account: "Cuenta de Ahorros - 001245",
    amount: "Q 850.00",
    status: "Completada",
    date: "28/03/2026",
  },
  {
    id: 3,
    type: "TRANSFERENCIA",
    account: "Cuenta Empresarial - 009921",
    amount: "Q 5,200.00",
    status: "Pendiente",
    date: "27/03/2026",
  },
];

const cuentasBancarias = [
  {
    id: 1,
    name: "Cuenta de Ahorros - 001245",
    number: "**** 2451",
    balance: "Q 18,800.00",
    status: "Activa",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Encabezado del dashboard */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Información General
          </h1>
          <p className="text-sm text-slate-500">
            Resumen y actividad reciente.
          </p>
        </div>

        <div className="flex gap-3">
          <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
            Nueva transacción
          </Button>
          <Button variant="outline" className="rounded-xl">
            Generar reporte
          </Button>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Saldo total</CardDescription>
              <CardTitle className="text-2xl font-bold">Q 245,000.00</CardTitle>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <Wallet className="h-5 w-5 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-600">
              +8.4% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Cuentas activas</CardDescription>
              <CardTitle className="text-2xl font-bold">128</CardTitle>
            </div>
            <div className="rounded-xl bg-slate-100 p-3">
              <CreditCard className="h-5 w-5 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Distribuidas entre ahorro y corriente
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Ingresos del día</CardDescription>
              <CardTitle className="text-2xl font-bold">Q 12,300.00</CardTitle>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3">
              <ArrowDownLeft className="h-5 w-5 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Operaciones de déposito procesadas
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Retiros del día</CardDescription>
              <CardTitle className="text-2xl font-bold">Q 7,860.00</CardTitle>
            </div>
            <div className="rounded-xl bg-rose-100 p-3">
              <ArrowUpRight className="h-5 w-5 text-rose-700" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Operaciones salientes registradas
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Panel Principal */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Actividad reciente */}
        <Card className="xl:col-span-2 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>
              Últimos movimientos procesados por el sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col justify-between gap-3 rounded-xl border p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-medium text-slate-900">{tx.type}</p>
                  <p className="text-sm text-slate-500">{tx.account}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    {tx.amount}
                  </span>
                  <Badge
                    variant={
                      tx.status === "Completada" ? "default" : "secondary"
                    }
                    className="rounded-lg"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cuentas destacadas */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Cuentas destacadas</CardTitle>
            <CardDescription>
              Resumen de cuentas principales activas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {cuentasBancarias.map((account) => (
              <div key={account.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{account.name}</p>
                  <Badge className="rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    {account.status}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-slate-500">{account.number}</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {account.balance}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Acciones rápidas */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Registrar depósito</CardTitle>
            <CardDescription>
              Procesa ingresos a cuentas bancarias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full rounded-xl">Ir a depósitos</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Registrar retiro</CardTitle>
            <CardDescription>
              Procesa retiros y validaciones de saldo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full rounded-xl">
              Ir a retiros
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Administrar cuentas</CardTitle>
            <CardDescription>
              Gestiona cuentas, estados y saldos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full rounded-xl">
              Ver cuentas
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
