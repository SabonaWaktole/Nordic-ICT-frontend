import { apiClient } from '../http/apiClient';
import type { AdminRepository, AdminModel, AdminCreateInput } from '../../domain/repositories/AdminRepository';

export class AxiosAdminRepository implements AdminRepository {
  async getByEmail(email: string): Promise<AdminModel> {
    const { data } = await apiClient.get<AdminModel>(`/v1/admin/${encodeURIComponent(email)}`);
    return data;
  }

  async list(): Promise<AdminModel[]> {
    const { data } = await apiClient.get<AdminModel[]>('/v1/admin/all');
    return data;
  }

  async create(input: AdminCreateInput): Promise<AdminModel> {
    const { data } = await apiClient.post<AdminModel>('/v1/admin/new', input);
    return data;
  }

  async update(id: number, input: Partial<AdminCreateInput>): Promise<AdminModel> {
    const { data } = await apiClient.put<AdminModel>(`/v1/admin/update/${id}`, input);
    return data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/v1/admin/delete/${id}`);
  }

  async uploadPhoto(file: File, adminId: number): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('adminId', String(adminId));
    const { data } = await apiClient.post<string>('/v1/admin/upload-photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
