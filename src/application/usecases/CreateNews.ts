import type { CreateNewsInput, NewsPost } from '../../domain/entities/NewsPost';
import type { NewsRepository } from '../../domain/repositories/NewsRepository';

export const createNews = (repo: NewsRepository) => async (input: CreateNewsInput): Promise<NewsPost> => {
  return repo.create(input);
};
