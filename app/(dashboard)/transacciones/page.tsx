import { ArrowDownLeft, ArrowUpRight, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: 1,
    type: "Depósito",
    account: "00124578",
    owner: "María López",
    amount: "Q 2,500.00",
    date: "28/03/2026",
    status: "Completada",
  },
  {
    id: 2,
    type: "Retiro",
    account: "00187421",
    owner: "Carlos Pérez",
    amount: "Q 850.00",
    date: "28/03/2026",
    status: "Completada",
  },
  {
    id: 3,
    type: "Transferencia",
    account: "00992134",
    owner: "Ana García",
    amount: "Q 5,200.00",
    date: "27/03/2026",
    status: "Pendiente",
  },
  {
    id: 4,
    type: "Retiro",
    account: "00451290",
    owner: "Luis Ramírez",
    amount: "Q 1,300.00",
    date: "27/03/2026",
    status: "Rechazada",
  },
];

function getStatusClasses(status: string) {
  switch (status) {
    case "Completada":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "Pendiente":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "Rechazada":
      return "bg-rose-100 text-rose-700 hover:bg-rose-100";
    default:
      return "";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "Depósito":
      return <ArrowDownLeft className="h-4 w-4 text-emerald-600" />;
    case "Retiro":
      return <ArrowUpRight className="h-4 w-4 text-rose-600" />;
    case "Transferencia":
      return <Repeat2 className="h-4 w-4 text-sky-600" />;
    default:
      return null;
  }
}

export default function TransaccionesPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transacciones</h1>
          <p className="text-sm text-slate-500">
            Historial general de movimientos financieros registrados en el
            sistema.
          </p>
        </div>

        <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
          Nueva transacción
        </Button>
      </section>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Listado de transacciones</CardTitle>
          <CardDescription>
            Consulta depósitos, retiros y transferencias recientes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {getTypeIcon(transaction.type)}
                        {transaction.type}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell>{transaction.owner}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-lg ${getStatusClasses(transaction.status)}`}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
