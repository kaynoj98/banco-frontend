import {
  Bell,
  Lock,
  Palette,
  Settings2,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-500">
            Administra preferencias generales, seguridad y ajustes del sistema.
          </p>
        </div>

        <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
          Guardar cambios
        </Button>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <Settings2 className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Parámetros básicos del sistema bancario.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Nombre del sistema: Banco Los Patitos</p>
            <p>• Entorno: Desarrollo</p>
            <p>• Moneda predeterminada: Quetzal (GTQ)</p>
            <p>• Idioma: Español</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Configuración de acceso y protección de datos.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Autenticación activa</p>
            <p>• Política de contraseñas habilitada</p>
            <p>• Sesiones controladas por usuario</p>
            <p>• Registro de auditoría habilitado</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <Bell className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Alertas y avisos operativos del sistema.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Alertas de transacciones habilitadas</p>
            <p>• Notificaciones por actividad sospechosa</p>
            <p>• Recordatorios administrativos activos</p>
            <p>• Avisos de mantenimiento programados</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <Palette className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personalización visual de la plataforma.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Tema actual: Claro</p>
            <p>• Estilo de panel: Corporativo</p>
            <p>• Componentes UI: Shadcn + Tailwind</p>
            <p>• Iconografía: Lucide React</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <UserCog className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Administración</CardTitle>
                <CardDescription>
                  Preferencias asociadas a usuarios y perfiles.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Gestión de roles habilitada</p>
            <p>• Permisos escalables por módulo</p>
            <p>• Control de usuarios activos e inactivos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <Lock className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Privacidad y control</CardTitle>
                <CardDescription>
                  Revisión de acceso y protección del entorno.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Logs de acceso disponibles</p>
            <p>• Actividad reciente bajo monitoreo</p>
            <p>• Control interno preparado para auditoría</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
