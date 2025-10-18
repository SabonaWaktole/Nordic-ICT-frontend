import { apiClient } from '../http/apiClient';
import type { NewsPost, CreateNewsInput } from '../../domain/entities/NewsPost';
import type { NewsRepository } from '../../domain/repositories/NewsRepository';

export class AxiosNewsRepository implements NewsRepository {
  async list(): Promise<NewsPost[]> {
    // GET /api/v1/news/all
    const { data } = await apiClient.get<NewsPost[]>('/v1/news/all');
    return data;
  }

  async create(input: CreateNewsInput): Promise<NewsPost> {
    // POST /api/v1/news/new/add
    const { data } = await apiClient.post<NewsPost>('/v1/news/new/add', input);
    return data;
  }

  async getById(id: string | number): Promise<NewsPost> {
    // GET /api/v1/news/{id}
    const { data } = await apiClient.get<NewsPost>(`/v1/news/${id}`);
    return data;
  }

  async update(id: string | number, input: Partial<CreateNewsInput>): Promise<NewsPost> {
    // PUT /api/v1/news/update/{id}
    const { data } = await apiClient.put<NewsPost>(`/v1/news/update/${id}`, input);
    return data;
  }

  async delete(id: string | number): Promise<void> {
    // DELETE /api/v1/news/del/{id}
    await apiClient.delete(`/v1/news/del/${id}`);
  }

  async uploadPhoto(file: File, newsId: string | number): Promise<string> {
    // POST /api/v1/news/upload-photo (multipart)
    const form = new FormData();
    form.append('file', file);
    form.append('newsId', String(newsId));
    const { data } = await apiClient.post<string>('/v1/news/upload-photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
