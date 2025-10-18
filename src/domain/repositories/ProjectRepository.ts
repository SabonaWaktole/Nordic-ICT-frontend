import type { Project } from '../entities/Project';

export interface ProjectRepository {
  list(): Promise<Project[]>;
}
