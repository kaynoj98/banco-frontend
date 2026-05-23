"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Landmark, Wallet } from "lucide-react";
import {
  createTransfer,
  fetchAccountTransactions,
  fetchMe,
  fetchMyAccounts,
  createAccountRequest,
  fetchAccountByNumber,
  type AccountResponseDto,
  type TransactionResponseDto,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function ClientDashboardPage() {
  const [fullName, setFullName] = useState("Cliente");
  const [profileId, setProfileId] = useState<string>("");
  const [accounts, setAccounts] = useState<AccountResponseDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
  const [destinationLookupName, setDestinationLookupName] = useState<string | null>(null);
  const [destinationLookupLoading, setDestinationLookupLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profile, accountList] = await Promise.all([fetchMe(), fetchMyAccounts()]);

      const transactionLists = await Promise.all(accountList.map((account) => fetchAccountTransactions(account.id)));
      const uniqueTransactions = new Map<string, TransactionResponseDto>();

      transactionLists.flat().forEach((transaction) => {
        uniqueTransactions.set(transaction.id, transaction);
      });

      const mergedTransactions = Array.from(uniqueTransactions.values()).sort(
        (left, right) => +new Date(right.timestamp) - +new Date(left.timestamp),
      );

      setFullName(`${profile.firstName} ${profile.lastName}`);
      setProfileId(profile.id);
      setAccounts(accountList);
      setTransactions(mergedTransactions);
      setSourceAccountId((current) => current || accountList[0]?.id || "");
      setDestinationAccountId((current) => current || accountList[1]?.id || accountList[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la informacion del cliente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((accumulator, account) => accumulator + account.balance, 0),
    [accounts],
  );

  const handleTransfer = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!sourceAccountId || !destinationAccountId) {
      setError("Debes seleccionar dos cuentas para transferir.");
      alert("Debes seleccionar dos cuentas para transferir.");
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      setError("La cuenta de origen y destino no pueden ser iguales.");
      alert("La cuenta de origen y destino no pueden ser iguales.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresa un monto valido.");
      alert("Ingresa un monto valido.");
      return;
    }

    void (async () => {
      try {
        setSubmitting(true);
        await createTransfer({
          sourceAccountId,
          destinationAccountId,
          amount: parsedAmount,
        });
        setAmount("");
        // Clear selected accounts and lookup fields so the form is reset
        setSourceAccountId("");
        setDestinationAccountId("");
        setDestinationAccountNumber("");
        setDestinationLookupName(null);
        setSuccess("Transferencia realizada correctamente.");
        // Inform the user with a native alert as requested
        alert("Transferencia realizada correctamente.");
        await loadData();
      } catch (transferError) {
        const msg = transferError instanceof Error ? transferError.message : "No se pudo completar la transferencia";
        setError(msg);
        // Notify user with alert for errors (insufficient funds, server errors, etc.)
        alert(msg);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const handleResolveDestination = async () => {
    if (!destinationAccountNumber) return;
    try {
      setDestinationLookupLoading(true);
      setDestinationLookupName(null);
      const acc = await fetchAccountByNumber(destinationAccountNumber.trim());
      setDestinationAccountId(acc.id);
      setDestinationLookupName(acc.ownerFullName || null);
    } catch (err) {
      setDestinationLookupName(null);
      setError(err instanceof Error ? err.message : "No se encontro la cuenta");
    } finally {
      setDestinationLookupLoading(false);
    }
  };

  const [reqType, setReqType] = useState("Corriente");
  const [reqInitial, setReqInitial] = useState<number>(0);
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!profileId) return alert("Perfil no cargado");
    try {
      setRequesting(true);
      await createAccountRequest({ userId: profileId, accountType: reqType, initialBalance: reqInitial });
      alert("Solicitud creada");
      await loadData();
      setReqInitial(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setRequesting(false);
    }
  };

  let accountsSection;
  if (loading) {
    accountsSection = <p className="text-sm text-slate-500">Cargando cuentas...</p>;
  } else if (accounts.length > 0) {
    accountsSection = accounts.map((account) => (
      <div key={account.id} className="rounded-2xl border border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900">{account.accountType}</p>
            <p className="text-sm text-slate-500">{account.accountNumber}</p>
          </div>
          <Badge className="rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Activa</Badge>
        </div>
        <p className="mt-4 text-2xl font-bold text-slate-900">{formatCurrency(account.balance)}</p>
      </div>
    ));
  } else {
    accountsSection = (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        No tienes cuentas registradas.
      </div>
    );
  }

  let transactionsSection;
  if (loading) {
    transactionsSection = <p className="text-sm text-slate-500">Cargando movimientos...</p>;
  } else if (transactions.length > 0) {
    transactionsSection = (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2 pr-4">Tipo</th>
              <th className="py-2 pr-4">Origen</th>
              <th className="py-2 pr-4">Destino</th>
              <th className="py-2 pr-4">Monto</th>
              <th className="py-2 pr-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-slate-100">
                <td className="py-3 pr-4 font-medium">{transaction.transactionType}</td>
                <td className="py-3 pr-4">{transaction.sourceAccountNumber ?? "-"}</td>
                <td className="py-3 pr-4">{transaction.destinationAccountNumber ?? "-"}</td>
                <td className="py-3 pr-4">{formatCurrency(transaction.amount)}</td>
                <td className="py-3 pr-4">{formatDate(transaction.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    transactionsSection = (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Aun no tienes movimientos registrados.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Vista de cliente</p>
        <h1 className="text-4xl font-bold text-slate-900">Bienvenido, {fullName}</h1>
        <p className="max-w-3xl text-slate-600">
          Aqui puedes revisar tus cuentas, ver tus movimientos y mover dinero entre tus propias cuentas.
        </p>
      </section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div> : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Cuentas</CardDescription>
              <CardTitle className="text-2xl">{accounts.length}</CardTitle>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3"><Landmark className="h-5 w-5 text-slate-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Cuentas asociadas a tu perfil</CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Saldo total</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(totalBalance)}</CardTitle>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3"><Wallet className="h-5 w-5 text-emerald-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Suma de tus saldos disponibles</CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription>Movimientos</CardDescription>
              <CardTitle className="text-2xl">{transactions.length}</CardTitle>
            </div>
            <div className="rounded-2xl bg-sky-100 p-3"><ArrowRightLeft className="h-5 w-5 text-sky-700" /></div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">Historial consolidado de tus cuentas</CardContent>
        </Card>
      </section>

      <section id="cuentas" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Tus cuentas</CardTitle>
            <CardDescription>Consulta saldos y tipo de cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accountsSection}
          </CardContent>
        </Card>
      </section>

      <section id="movimientos" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Movimientos</CardTitle>
            <CardDescription>Historial consolidado de tus cuentas.</CardDescription>
          </CardHeader>
          <CardContent>{transactionsSection}</CardContent>
        </Card>
      </section>

      <section id="solicitar-cuenta" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Solicitar nueva cuenta</CardTitle>
            <CardDescription>Envía una solicitud para que un administrador cree una cuenta para ti.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={handleRequest}>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Tipo de cuenta</span>
                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={reqType} onChange={(e) => setReqType(e.target.value)}>
                  <option value="Corriente">Corriente</option>
                  <option value="Ahorro">Ahorro</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Depósito inicial (opcional)</span>
                <Input type="number" step="0.01" min="0" value={reqInitial} onChange={(e) => setReqInitial(Number(e.target.value))} className="h-11 rounded-xl" />
              </label>

              <div className="flex items-end">
                <Button type="submit" className="h-11 w-full rounded-xl bg-slate-900 hover:bg-slate-800" disabled={requesting}>
                  {requesting ? "Enviando..." : "Solicitar cuenta"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section id="transferencia" className="space-y-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Transferir entre tus cuentas</CardTitle>
            <CardDescription>Movimiento interno entre cuentas del mismo cliente.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleTransfer}>
              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Cuenta origen</span>
                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={sourceAccountId} onChange={(event) => setSourceAccountId(event.target.value)} required>
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Cuenta destino (número)</span>
                <Input
                  type="text"
                  value={destinationAccountNumber}
                  onChange={(e) => setDestinationAccountNumber(e.target.value)}
                  placeholder="Ejemplo: 00123456789"
                  className="h-11 rounded-xl"
                />
                <div className="flex gap-2 mt-2">
                  <Button type="button" onClick={handleResolveDestination} disabled={destinationLookupLoading} className="h-9">
                    {destinationLookupLoading ? "Buscando..." : "Buscar por número"}
                  </Button>
                  <Button type="button" onClick={() => { setDestinationAccountNumber(""); setDestinationAccountId(""); setDestinationLookupName(null); }} variant="ghost" className="h-9">
                    Limpiar
                  </Button>
                </div>
                {destinationLookupName ? <p className="text-xs text-slate-500 mt-2">Titular: {destinationLookupName}</p> : null}
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Monto</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="h-11 rounded-xl"
                  required
                />
              </label>

              <div className="flex items-end">
                <Button type="submit" className="h-11 w-full rounded-xl bg-slate-900 hover:bg-slate-800" disabled={submitting || accounts.length === 0}>
                  {submitting ? "Procesando..." : "Realizar transferencia"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}