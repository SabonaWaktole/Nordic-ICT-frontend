import type { AuthRepository, LoginInput, LoginResponse } from '../../domain/repositories/AuthRepository';

export const loginUseCase = (repo: AuthRepository) => async (input: LoginInput): Promise<LoginResponse> => {
  return repo.login(input);
};
