import { Mail, Pencil, ShieldCheck, Trash2, User } from "lucide-react";
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

const usuarios = [
  {
    id: 1,
    name: "María López",
    email: "maria.lopez@banco.com",
    role: "Administrador",
    status: "Activo",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos.perez@banco.com",
    role: "Cajero",
    status: "Activo",
  },
  {
    id: 3,
    name: "Ana García",
    email: "ana.garcia@banco.com",
    role: "Supervisor",
    status: "Pendiente",
  },
  {
    id: 4,
    name: "Luis Ramírez",
    email: "luis.ramirez@banco.com",
    role: "Analista",
    status: "Inactivo",
  },
];

function getStatusClasses(status: string) {
  switch (status) {
    case "Activo":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "Pendiente":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "Inactivo":
      return "bg-slate-200 text-slate-700 hover:bg-slate-200";
    default:
      return "";
  }
}

function getRoleIcon(role: string) {
  if (role === "Administrador" || role === "Supervisor") {
    return <ShieldCheck className="h-4 w-4 text-sky-600" />;
  }

  return <User className="h-4 w-4 text-slate-600" />;
}
export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">
            Administración general de usuarios del sistema bancario.
          </p>
        </div>

        <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
          Nuevo usuario
        </Button>
      </section>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
          <CardDescription>
            Consulta usuarios registrados, rol asignado y estado actual.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <User className="h-4 w-4 text-slate-600" />
                        {user.name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="h-4 w-4 text-slate-500" />
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`rounded-lg ${getStatusClasses(user.status)}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
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
