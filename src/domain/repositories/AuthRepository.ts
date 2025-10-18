import type { User } from '../entities/User';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string; // JWT or session token
  user: User;
}

export interface AuthRepository {
  login(input: LoginInput): Promise<LoginResponse>;
  me?(): Promise<User>; // optional: fetch current user
}
