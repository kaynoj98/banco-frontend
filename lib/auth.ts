const AUTH_TOKEN_KEY = "authToken";
const AUTH_ROLE_KEY = "authRole";
const AUTH_NAME_KEY = "authFullName";

export type AuthRole = "Admin" | "Supervisor" | "Cajero" | "Cliente";

export type AuthSession = {
  token: string;
  role: string;
  fullName: string;
};

export function getHomePathForRole(role: string | null | undefined) {
  return role === "Cliente" ? "/dashboard/cliente" : "/dashboard/admin";
}

export function getAuthToken(): string | null {
  if (globalThis.window === undefined) {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthRole(): string | null {
  if (globalThis.window === undefined) {
    return null;
  }

  return localStorage.getItem(AUTH_ROLE_KEY);
}

export function getAuthFullName(): string | null {
  if (globalThis.window === undefined) {
    return null;
  }

  return localStorage.getItem(AUTH_NAME_KEY);
}

export function setAuthToken(token: string) {
  if (globalThis.window === undefined) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function setAuthSession(session: AuthSession) {
  if (globalThis.window === undefined) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_ROLE_KEY, session.role);
  localStorage.setItem(AUTH_NAME_KEY, session.fullName);
}

export function removeAuthToken() {
  if (globalThis.window === undefined) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
