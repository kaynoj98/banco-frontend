import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const cuentas = [
  {
    id: 1,
    number: "00124578",
    owner: "María López",
    type: "Ahorro",
    balance: "Q 18,450.00",
    status: "Activo",
  },
  {
    id: 2,
    number: "00187421",
    owner: "Carlos Pérez",
    type: "Corriente",
    balance: "Q 42,800.00",
    status: "Activo",
  },
  {
    id: 3,
    number: "00992134",
    owner: "Ana García",
    type: "Empresarial",
    balance: "Q 5,200.00",
    status: "Pendiente",
  },
  {
    id: 4,
    number: "00451290",
    owner: "Luis Ramírez",
    type: "Ahorro",
    balance: "Q 9,750.00",
    status: "Bloqueado",
  },
];

function getStatusClasses(status: string) {
  switch (status) {
    case "Activo":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "Pendiente":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "Bloqueado":
      return "bg-rose-100 text-rose-700 hover:bg-rose-100";
    default:
      return "";
  }
}

export default function CuentasPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cuentas</h1>
          <p className="text-sm text-slate-500">
            Cuentas registradas en el sistema
          </p>
        </div>

        <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
          Nueva Cuenta
        </Button>
      </section>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Listado de cuentas</CardTitle>
          <CardDescription>
            Visualiza el estado, saldo y propietario de cada cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Cuenta</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cuentas.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      {account.number}
                    </TableCell>
                    <TableCell>{account.owner}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>{account.balance}</TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-lg ${getStatusClasses(account.status)}`}
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
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
