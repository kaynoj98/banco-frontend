import { getAuthToken } from "./auth";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  role: string;
  userId: string;
  fullName: string;
  expiresAt: string;
};

export type UserResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AccountResponseDto = {
  id: string;
  userId: string;
  ownerFullName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
};

export type TransactionResponseDto = {
  id: string;
  sourceAccountId: string | null;
  sourceAccountNumber: string | null;
  destinationAccountId: string | null;
  destinationAccountNumber: string | null;
  amount: number;
  transactionType: string;
  executedById: string;
  executedByName: string;
  timestamp: string;
};

export type TransferRequestDto = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
};
export type AccountRequestResponseDto = {
  id: string;
  userId: string;
  userFullName: string;
  accountType: string;
  initialBalance: number;
  status: string;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  note?: string | null;
};

export type PermissionSummaryDto = {
  id: string;
  code: string;
  description: string;
};

export type RoleResponseDto = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: PermissionSummaryDto[];
};

export type CreateRoleDto = {
  name: string;
  description: string;
};

export type UpdateRoleDto = {
  name: string;
  description: string;
  isActive: boolean;
};

export type UpdateRolePermissionsDto = {
  permissionIds: string[];
};

export type CreatePermissionDto = {
  code: string;
  description: string;
};

export type UpdatePermissionDto = {
  code: string;
  description: string;
};

type ApiErrorBody = {
  message?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function parseError(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  return body?.message || response.statusText || "Error en la API";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function apiFetchAuth<T>(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No estás autenticado");
  }

  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function login(dto: LoginRequestDto): Promise<LoginResponseDto> {
  return apiFetch<LoginResponseDto>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function fetchMe(): Promise<UserResponseDto> {
  return apiFetchAuth<UserResponseDto>("/users/me");
}

export async function fetchUsers(): Promise<UserResponseDto[]> {
  return apiFetchAuth<UserResponseDto[]>("/users");
}

export async function fetchAccounts(): Promise<AccountResponseDto[]> {
  return apiFetchAuth<AccountResponseDto[]>("/accounts");
}

export type CreateAccountRequestDto = {
  userId: string;
  accountType: string;
  initialBalance: number;
};

export async function createAccount(dto: CreateAccountRequestDto): Promise<AccountResponseDto> {
  return apiFetchAuth<AccountResponseDto>("/accounts", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function fetchMyAccounts(): Promise<AccountResponseDto[]> {
  return apiFetchAuth<AccountResponseDto[]>("/accounts/my-accounts");
}

export async function fetchAllTransactions(): Promise<TransactionResponseDto[]> {
  return apiFetchAuth<TransactionResponseDto[]>("/transactions");
}

export async function fetchAccountTransactions(accountId: string): Promise<TransactionResponseDto[]> {
  return apiFetchAuth<TransactionResponseDto[]>(`/transactions/account/${accountId}`);
}

export async function createTransfer(dto: TransferRequestDto): Promise<TransactionResponseDto> {
  return apiFetchAuth<TransactionResponseDto>("/transactions/transfer", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function createAccountRequest(dto: CreateAccountRequestDto): Promise<AccountRequestResponseDto> {
  return apiFetchAuth<AccountRequestResponseDto>("/accountrequests" , {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function fetchAccountRequests(): Promise<AccountRequestResponseDto[]> {
  return apiFetchAuth<AccountRequestResponseDto[]>("/accountrequests");
}

export async function approveAccountRequest(id: string): Promise<AccountRequestResponseDto> {
  return apiFetchAuth<AccountRequestResponseDto>(`/accountrequests/${id}/approve`, { method: "POST" });
}

export async function rejectAccountRequest(id: string, reason?: string): Promise<AccountRequestResponseDto> {
  return apiFetchAuth<AccountRequestResponseDto>(`/accountrequests/${id}/reject`, {
    method: "POST",
    body: reason ? JSON.stringify(reason) : undefined,
  });
}

export async function fetchRoles(): Promise<RoleResponseDto[]> {
  return apiFetchAuth<RoleResponseDto[]>("/roles");
}

export async function createRole(dto: CreateRoleDto): Promise<RoleResponseDto> {
  return apiFetchAuth<RoleResponseDto>("/roles", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateRole(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
  return apiFetchAuth<RoleResponseDto>(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteRole(id: string): Promise<void> {
  await apiFetchAuth<void>(`/roles/${id}`, { method: "DELETE" });
}

export async function updateRolePermissions(id: string, dto: UpdateRolePermissionsDto): Promise<RoleResponseDto> {
  return apiFetchAuth<RoleResponseDto>(`/roles/${id}/permissions`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function fetchPermissions(): Promise<PermissionSummaryDto[]> {
  return apiFetchAuth<PermissionSummaryDto[]>("/permissions");
}

export async function createPermission(dto: CreatePermissionDto): Promise<PermissionSummaryDto> {
  return apiFetchAuth<PermissionSummaryDto>("/permissions", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updatePermission(id: string, dto: UpdatePermissionDto): Promise<PermissionSummaryDto> {
  return apiFetchAuth<PermissionSummaryDto>(`/permissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deletePermission(id: string): Promise<void> {
  await apiFetchAuth<void>(`/permissions/${id}`, { method: "DELETE" });
}

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
};

export async function createUser(dto: CreateUserDto): Promise<UserResponseDto> {
  return apiFetchAuth<UserResponseDto>("/users", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function fetchAccountByNumber(number: string): Promise<AccountResponseDto> {
  return apiFetchAuth<AccountResponseDto>(`/accounts/by-number/${encodeURIComponent(number)}`);
}
