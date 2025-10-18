import { apiClient } from '../http/apiClient';
import { AuthStorage } from './AxiosAuthRepository';
import type { NewsPost, CreateNewsInput } from '../../domain/entities/NewsPost';
import type { NewsRepository } from '../../domain/repositories/NewsRepository';

export class AxiosNewsRepository implements NewsRepository {
  private getEmailParam() {
    try {
      const stored = localStorage.getItem(AuthStorage.USER_KEY);
      if (!stored) return '';
      const parsed = JSON.parse(stored) as { email?: string } | null;
      const email = parsed?.email;
      return email ? `?email=${encodeURIComponent(email)}` : '';
    } catch {
      return '';
    }
  }

  private extractArray<T = unknown>(data: unknown): T[] | null {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object') {
      const rec = data as Record<string, unknown>;
      for (const key of ['content', 'items', 'data']) {
        const maybe = rec[key];
        if (Array.isArray(maybe)) return maybe as T[];
      }
    }
    return null;
  }

  async list(): Promise<NewsPost[]> {
    // GET /api/v1/news/all?email=...
    const emailQ = this.getEmailParam();
    const { data } = await apiClient.get<unknown>(`/v1/news/all${emailQ}`);
    const arr = this.extractArray<NewsPost>(data);
    if (!arr) throw new Error('Unexpected news list response');
    return arr;
  }

  async create(input: CreateNewsInput): Promise<NewsPost> {
    // POST /api/v1/news/new/add?email=...
    const emailQ = this.getEmailParam();
    const { data } = await apiClient.post<NewsPost>(`/v1/news/new/add${emailQ}`, input);
    return data;
  }

  async getById(id: string | number): Promise<NewsPost> {
    // GET /api/v1/news/{id}?email=...
    const emailQ = this.getEmailParam();
    const { data } = await apiClient.get<NewsPost>(`/v1/news/${id}${emailQ}`);
    return data;
  }

  async update(id: string | number, input: Partial<CreateNewsInput>): Promise<NewsPost> {
    // PUT /api/v1/news/update/{id}?email=...
    const emailQ = this.getEmailParam();
    const { data } = await apiClient.put<NewsPost>(`/v1/news/update/${id}${emailQ}`, input);
    return data;
  }

  async delete(id: string | number): Promise<void> {
    // DELETE /api/v1/news/del/{id}?email=...
    const emailQ = this.getEmailParam();
    await apiClient.delete(`/v1/news/del/${id}${emailQ}`);
  }

  async uploadPhoto(file: File, newsId: string | number): Promise<string> {
    // POST /api/v1/news/upload-photo/{newsId}?email=... (multipart)
    const form = new FormData();
    form.append('file', file);
    const emailQ = this.getEmailParam();
    const { data } = await apiClient.post<string>(`/v1/news/upload-photo/${encodeURIComponent(String(newsId))}${emailQ}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
