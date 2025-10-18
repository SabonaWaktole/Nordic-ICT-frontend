import { apiClient } from '../http/apiClient';
import type { Project } from '../../domain/entities/Project';
import type { ProjectRepository } from '../../domain/repositories/ProjectRepository';

export class AxiosProjectRepository implements ProjectRepository {
  async list(): Promise<Project[]> {
    // GET /api/v1/projects (via apiClient baseURL '/api')
    const { data } = await apiClient.get<Project[]>('/v1/projects');
    // If API dates are ISO strings, convert here if needed
    return data.map(p => ({ ...p, startDate: new Date(p.startDate), endDate: p.endDate ? new Date(p.endDate) : undefined }));
  }
}
