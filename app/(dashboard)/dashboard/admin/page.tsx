"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Landmark, Users, Wallet } from "lucide-react";
import {
  fetchAccounts,
  createAccount,
  fetchAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
  fetchAllTransactions,
  fetchUsers,
  type AccountResponseDto,
  type AccountRequestResponseDto,
  type TransactionResponseDto,
  type UserResponseDto,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function typeBadgeClass(type: string) {
  switch (type) {
    case "Deposito":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "Retiro":
      return "bg-rose-100 text-rose-700 hover:bg-rose-100";
    default:
      return "bg-sky-100 text-sky-700 hover:bg-sky-100";
  }
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const [creating, setCreating] = useState(false);
  const [newAccountUserId, setNewAccountUserId] = useState<string>("");
  const [newAccountType, setNewAccountType] = useState<string>("Corriente");
  const [newAccountInitial, setNewAccountInitial] = useState<number>(0);
  const [requests, setRequests] = useState<AccountRequestResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [usersData, accountsData, transactionsData] = await Promise.all([
          fetchUsers(),
          fetchAccounts(),
          fetchAllTransactions(),
        ]);

        const requestsData = await fetchAccountRequests();

        setUsers(usersData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setRequests(requestsData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((accumulator, account) => accumulator + account.balance, 0),
    [accounts],
  );

  const accountsByUser = useMemo(() => {
    return accounts.reduce<Record<string, number>>((accumulator, account) => {
      accumulator[account.userId] = (accumulator[account.userId] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [accounts]);

  const usersByRole = useMemo(() => {
    return users.reduce<Record<string, number>>((accumulator, user) => {
      accumulator[user.role] = (accumulator[user.role] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [users]);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Vista de administracion</p>
        <h1 className="text-4xl font-bold text-slate-900">Usuarios, cuentas y transacciones</h1>
        <p className="max-w-3xl text-slate-600">
          Este panel muestra la operacion completa del banco para supervisar clientes, cuentas y movimientos en tiempo real.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Usuarios</CardDescription>
              <CardTitle className="text-2xl">{users.length}</CardTitle>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3"><Users className="h-5 w-5 text-slate-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">{usersByRole.Admin ?? 0} administradores y {usersByRole.Cliente ?? 0} clientes</CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Cuentas</CardDescription>
              <CardTitle className="text-2xl">{accounts.length}</CardTitle>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3"><Landmark className="h-5 w-5 text-slate-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Saldo total administrado: {formatCurrency(totalBalance)}</CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Transacciones</CardDescription>
              <CardTitle className="text-2xl">{transactions.length}</CardTitle>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3"><BadgeCheck className="h-5 w-5 text-emerald-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Movimientos auditables en el sistema</CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Cuentas por usuario</CardDescription>
              <CardTitle className="text-2xl">{Object.values(accountsByUser).reduce((sum, count) => sum + count, 0)}</CardTitle>
            </div>
            <div className="rounded-2xl bg-amber-100 p-3"><Wallet className="h-5 w-5 text-amber-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Relacion de cuentas activas por cliente</CardContent>
        </Card>
      </section>

      <section id="usuarios" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Lista de usuarios y su cantidad de cuentas asociadas.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Cargando usuarios...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Cuentas</TableHead>
                      <TableHead>Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><Badge className="rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-100">{user.role}</Badge></TableCell>
                        <TableCell>{accountsByUser[user.id] ?? 0}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="cuentas" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Cuentas</CardTitle>
            <CardDescription>Saldo, numero de cuenta y propietario.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-1">
                <label className="block text-sm text-slate-600">Titular</label>
                <select
                  className="mt-1 block w-full rounded-md border p-2"
                  value={newAccountUserId}
                  onChange={(e) => setNewAccountUserId(e.target.value)}
                >
                  <option value="">Seleccione un usuario</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600">Tipo</label>
                <select className="mt-1 block w-full rounded-md border p-2" value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}>
                  <option value="Corriente">Corriente</option>
                  <option value="Ahorro">Ahorro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600">Depósito inicial</label>
                <input className="mt-1 block w-full rounded-md border p-2" type="number" min={0} step="0.01" value={newAccountInitial} onChange={(e) => setNewAccountInitial(Number(e.target.value))} />
              </div>

              <div className="flex items-end">
                <button
                  className="rounded-xl bg-slate-900 px-4 py-2 text-white"
                  disabled={creating || !newAccountUserId}
                  onClick={async () => {
                    try {
                      setCreating(true);
                      await createAccount({ userId: newAccountUserId, accountType: newAccountType, initialBalance: newAccountInitial });
                      const refreshed = await fetchAccounts();
                      setAccounts(refreshed);
                      setNewAccountUserId("");
                      setNewAccountInitial(0);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : String(err));
                    } finally {
                      setCreating(false);
                    }
                  }}
                >
                  {creating ? "Creando..." : "Crear cuenta"}
                </button>
              </div>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Cargando cuentas...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.accountNumber}</TableCell>
                        <TableCell>{account.ownerFullName}</TableCell>
                        <TableCell>{account.accountType}</TableCell>
                        <TableCell>{formatCurrency(account.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="transacciones" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Transacciones</CardTitle>
            <CardDescription>Ultimos movimientos registrados en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Cargando transacciones...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Ejecutado por</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge className={`rounded-lg ${typeBadgeClass(transaction.transactionType)}`}>{transaction.transactionType}</Badge>
                        </TableCell>
                        <TableCell>{transaction.sourceAccountNumber ?? "-"}</TableCell>
                        <TableCell>{transaction.destinationAccountNumber ?? "-"}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{transaction.executedByName}</TableCell>
                        <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

          <section id="solicitudes" className="space-y-4">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Solicitudes de cuentas</CardTitle>
                <CardDescription>Revisa y procesa las solicitudes enviadas por clientes.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-slate-500">Cargando solicitudes...</p>
                ) : requests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">No hay solicitudes nuevas.</div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{r.userFullName} — {r.accountType}</div>
                          <div className="text-sm text-slate-500">Depósito inicial: {r.initialBalance}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="rounded-md bg-emerald-600 px-3 py-1 text-white" onClick={async () => {
                            try {
                              await approveAccountRequest(r.id);
                              const refreshed = await fetchAccountRequests();
                              setRequests(refreshed);
                              const refreshedAccounts = await fetchAccounts();
                              setAccounts(refreshedAccounts);
                            } catch (err) {
                              alert(err instanceof Error ? err.message : String(err));
                            }
                          }}>Aprobar</button>
                          <button className="rounded-md bg-rose-600 px-3 py-1 text-white" onClick={async () => {
                            try {
                              await rejectAccountRequest(r.id, "Rechazado por admin");
                              const refreshed = await fetchAccountRequests();
                              setRequests(refreshed);
                            } catch (err) {
                              alert(err instanceof Error ? err.message : String(err));
                            }
                          }}>Rechazar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
    </div>
  );
}