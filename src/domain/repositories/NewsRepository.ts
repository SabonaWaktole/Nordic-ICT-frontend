import type { NewsPost, CreateNewsInput } from '../entities/NewsPost';

export interface NewsRepository {
  list(): Promise<NewsPost[]>;
  create(input: CreateNewsInput): Promise<NewsPost>;
  getById(id: string | number): Promise<NewsPost>;
  update(id: string | number, input: Partial<CreateNewsInput>): Promise<NewsPost>;
  delete(id: string | number): Promise<void>;
  uploadPhoto(file: File, newsId: string | number): Promise<string>; // returns public URL
}
