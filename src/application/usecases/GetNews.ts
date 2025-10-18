import type { NewsPost } from '../../domain/entities/NewsPost';
import type { NewsRepository } from '../../domain/repositories/NewsRepository';

export const getNews = (repo: NewsRepository): Promise<NewsPost[]> => repo.list();
