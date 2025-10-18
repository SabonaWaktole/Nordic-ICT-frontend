import { apiClient } from '../http/apiClient';
import type { AuthRepository, LoginInput, LoginResponse } from '../../domain/repositories/AuthRepository';
import type { User } from '../../domain/entities/User';

// Local storage keys
const TOKEN_KEY = 'nordic-auth-token';
const USER_KEY = 'nordic-admin-user';

// Attach token to subsequent requests if present
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export class AxiosAuthRepository implements AuthRepository {
  async login(input: LoginInput): Promise<LoginResponse> {
    // Backend AdminController login: POST /api/v1/admin/login
    // Allow unknown extra fields but type known ones
    const { data } = await apiClient.post<Record<string, unknown>>('/v1/admin/login', input);

    // Support various token field names just in case
    const rawToken = (data as Record<string, unknown>)?.token
      ?? (data as Record<string, unknown>)?.accessToken
      ?? (data as Record<string, unknown>)?.jwt;
    const token = typeof rawToken === 'string' ? rawToken : undefined;
    if (!token) {
      throw new Error('Login failed: token not found in response');
    }

    // Persist token and attach header for next requests BEFORE fetching user
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch the admin user via GET /api/v1/admin/{email}
    let user: User | undefined;
    try {
      const { data: adminData } = await apiClient.get<unknown>(`/v1/admin/${encodeURIComponent(input.email)}`);
      const rec = (typeof adminData === 'object' && adminData !== null) ? (adminData as Record<string, unknown>) : {};
      user = {
        id: String(rec.id ?? ''),
        name: String(rec.name ?? rec.fullName ?? rec.username ?? input.email),
        email: String(rec.email ?? input.email),
        profilePhoto: typeof rec.profilePhoto === 'string' ? rec.profilePhoto : undefined,
      };
    } catch {
      // fallback: try using inline user if provided
      const inline = (data as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
      if (inline && typeof inline === 'object') {
        user = {
          id: String(inline.id ?? ''),
          name: String(inline.name ?? inline.fullName ?? inline.username ?? input.email),
          email: String(inline.email ?? input.email),
          profilePhoto: typeof inline.profilePhoto === 'string' ? inline.profilePhoto : undefined,
        };
      }
    }

    if (!user) {
      // Clean up token if we cannot resolve a user
      localStorage.removeItem(TOKEN_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
      throw new Error('Login failed: unable to resolve user');
    }

    // Persist user once resolved
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { token, user };
  }

  // For Admin flow, rely on stored user (we already fetch by email during login)
  async me(): Promise<User> {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored) as User;
    throw new Error('me() not available without stored user');
  }
}

export const AuthStorage = {
  TOKEN_KEY,
  USER_KEY,
};
