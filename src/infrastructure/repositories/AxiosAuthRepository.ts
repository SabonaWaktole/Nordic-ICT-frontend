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
    // Adjust path to your backend: e.g., POST /api/v1/auth/login
    const { data } = await apiClient.post<LoginResponse>('/v1/admin/login', input);

    // Persist token and user
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    // Set Authorization header for future requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    return data;
  }

  async me(): Promise<User> {
    const { data } = await apiClient.get<User>('/v1/admin/all');
    return data;
  }
}

export const AuthStorage = {
  TOKEN_KEY,
  USER_KEY,
};
