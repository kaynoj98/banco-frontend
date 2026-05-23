"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, Pencil, Plus, Save, Shield, Trash2 } from "lucide-react";
import {
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  fetchPermissions,
  fetchRoles,
  updatePermission,
  updateRole,
  updateRolePermissions,
  type PermissionSummaryDto,
  type RoleResponseDto,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const emptyRoleForm = {
  name: "",
  description: "",
  isActive: true,
};

const emptyPermissionForm = {
  code: "",
  description: "",
};

function sortByCode(items: PermissionSummaryDto[]) {
  return [...items].sort((left, right) => left.code.localeCompare(right.code));
}

export function RBACManager() {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionSummaryDto[]>([]);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);
  const [permissionForm, setPermissionForm] = useState(emptyPermissionForm);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState(false);
  const [savingPermission, setSavingPermission] = useState(false);
  const [savingRolePermissions, setSavingRolePermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTogglePermission(permissionId: string, checked: boolean) {
    setSelectedPermissionIds((current) =>
      checked ? [...current, permissionId] : current.filter((item) => item !== permissionId),
    );
  }

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([fetchRoles(), fetchPermissions()]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setError(null);

      if (!selectedRoleId && rolesData.length > 0) {
        setSelectedRoleId(rolesData[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los permisos y roles");
    } finally {
      setLoading(false);
    }
  }, [selectedRoleId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const role = roles.find((item) => item.id === selectedRoleId);
    setSelectedPermissionIds(role ? role.permissions.map((permission) => permission.id) : []);
  }, [roles, selectedRoleId]);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const activeRoles = useMemo(() => roles.filter((role) => role.isActive).length, [roles]);

  async function handleSaveRole() {
    try {
      setSavingRole(true);
      if (editingRoleId) {
        await updateRole(editingRoleId, roleForm);
      } else {
        await createRole({ name: roleForm.name, description: roleForm.description });
      }

      setRoleForm(emptyRoleForm);
      setEditingRoleId(null);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el rol");
    } finally {
      setSavingRole(false);
    }
  }

  async function handleDeleteRole(roleId: string) {
    if (!confirm("¿Eliminar este rol?")) {
      return;
    }

    try {
      await deleteRole(roleId);
      if (selectedRoleId === roleId) {
        setSelectedRoleId("");
      }
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el rol");
    }
  }

  async function handleSavePermissions() {
    try {
      setSavingPermission(true);
      if (editingPermissionId) {
        await updatePermission(editingPermissionId, permissionForm);
      } else {
        await createPermission(permissionForm);
      }

      setPermissionForm(emptyPermissionForm);
      setEditingPermissionId(null);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el permiso");
    } finally {
      setSavingPermission(false);
    }
  }

  async function handleDeletePermission(permissionId: string) {
    if (!confirm("¿Eliminar este permiso?")) {
      return;
    }

    try {
      await deletePermission(permissionId);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el permiso");
    }
  }

  async function handleSaveRolePermissions() {
    if (!selectedRole) {
      return;
    }

    try {
      setSavingRolePermissions(true);
      await updateRolePermissions(selectedRole.id, { permissionIds: selectedPermissionIds });
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudieron actualizar los permisos del rol");
    } finally {
      setSavingRolePermissions(false);
    }
  }

  return (
    <section id="roles-permisos" className="space-y-6">
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Roles y permisos</CardTitle>
          <CardDescription>Administra el acceso del sistema y asigna permisos a cada rol.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Roles totales</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{roles.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Roles activos</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{activeRoles}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Permisos disponibles</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{permissions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-700" />
              Roles
            </CardTitle>
            <CardDescription>Crea, edita y elimina roles de acceso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm text-slate-600" htmlFor="role-name">Nombre</label>
                  <Input
                    id="role-name"
                    value={roleForm.name}
                    onChange={(event) => setRoleForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Supervisor"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600" htmlFor="role-description">Descripción</label>
                  <Input
                    id="role-description"
                    value={roleForm.description}
                    onChange={(event) => setRoleForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Rol para supervisión operativa"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  id="role-active"
                  type="checkbox"
                  checked={roleForm.isActive}
                  onChange={(event) => setRoleForm((current) => ({ ...current, isActive: event.target.checked }))}
                />
                <label htmlFor="role-active">Rol activo</label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleSaveRole}
                  disabled={savingRole || !roleForm.name.trim() || !roleForm.description.trim()}
                >
                  <Save className="h-4 w-4" />
                  {editingRoleId ? "Guardar cambios" : "Crear rol"}
                </Button>
                {editingRoleId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRoleForm(emptyRoleForm);
                      setEditingRoleId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando roles...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="font-medium text-slate-900">{role.name}</div>
                          <div className="text-sm text-slate-500">{role.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={role.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                            {role.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{role.permissions.length}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingRoleId(role.id);
                                setRoleForm({ name: role.name, description: role.description, isActive: role.isActive });
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-slate-700" />
              Permisos
            </CardTitle>
            <CardDescription>Registra permisos individuales para reutilizarlos en los roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm text-slate-600" htmlFor="permission-code">Código</label>
                  <Input
                    id="permission-code"
                    value={permissionForm.code}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, code: event.target.value }))}
                    placeholder="accounts.create"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600" htmlFor="permission-description">Descripción</label>
                  <Input
                    id="permission-description"
                    value={permissionForm.description}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Crear cuentas bancarias"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={savingPermission || !permissionForm.code.trim() || !permissionForm.description.trim()}
                >
                  <Plus className="h-4 w-4" />
                  {editingPermissionId ? "Guardar cambios" : "Crear permiso"}
                </Button>
                {editingPermissionId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPermissionForm(emptyPermissionForm);
                      setEditingPermissionId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando permisos...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortByCode(permissions).map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.code}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingPermissionId(permission.id);
                                setPermissionForm({ code: permission.code, description: permission.description });
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePermission(permission.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Asignar permisos a rol</CardTitle>
          <CardDescription>Marca los permisos que debe tener el rol seleccionado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-1">
            <label className="text-sm text-slate-600" htmlFor="selected-role">Rol</label>
            <select
              id="selected-role"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRole ? (
            <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{selectedRole.name}</h3>
                <p className="text-sm text-slate-500">{selectedRole.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sortByCode(permissions).map((permission) => {
                  const checked = selectedPermissionIds.includes(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3 text-sm"
                    >
                      <input
                        id={`permission-${permission.id}`}
                        type="checkbox"
                        className="mt-1"
                        checked={checked}
                        onChange={(event) => handleTogglePermission(permission.id, event.target.checked)}
                      />
                      <label htmlFor={`permission-${permission.id}`} className="cursor-pointer">
                        <div className="font-medium text-slate-900">{permission.code}</div>
                        <div className="text-slate-500">{permission.description}</div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleSaveRolePermissions} disabled={savingRolePermissions}>
                  <Save className="h-4 w-4" />
                  Guardar permisos del rol
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedPermissionIds(permissions.map((permission) => permission.id))}
                >
                  Seleccionar todos
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedPermissionIds([])}>
                  Limpiar selección
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Selecciona un rol para ver y editar sus permisos.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
