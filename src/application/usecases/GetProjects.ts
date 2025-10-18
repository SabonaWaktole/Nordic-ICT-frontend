import type { Project } from '../../domain/entities/Project';
import type { ProjectRepository } from '../../domain/repositories/ProjectRepository';

// Function-based use case to comply with "erasableSyntaxOnly"
export const getProjects = (repo: ProjectRepository): Promise<Project[]> => repo.list();
