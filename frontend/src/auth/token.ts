const TOKEN_KEY = 'visa_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    const payloadSegment = token.split('.')[1];
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized)) as { exp?: number };

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
