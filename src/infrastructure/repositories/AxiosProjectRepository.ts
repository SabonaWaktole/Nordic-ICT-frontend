import { apiClient } from '../http/apiClient';
import type { Project } from '../../domain/entities/Project';
import type { ProjectRepository } from '../../domain/repositories/ProjectRepository';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractArray(value: unknown): Array<unknown> | null {
  if (Array.isArray(value)) return value;
  if (isRecord(value)) {
    const candidates = ['content', 'items', 'data'] as const;
    for (const key of candidates) {
      const maybeArr = value[key as keyof typeof value];
      if (Array.isArray(maybeArr)) return maybeArr as Array<unknown>;
    }
  }
  return null;
}

export class AxiosProjectRepository implements ProjectRepository {
  async list(): Promise<Project[]> {
    // Try common endpoints and response shapes
    const tryFetch = async (path: string) => {
      const { data } = await apiClient.get<unknown>(path);
      const arr = extractArray(data);
      if (!arr) throw new Error('Unexpected projects response shape');
      return arr;
    };

    let raw: Array<unknown> | null = null;
    const paths = ['/v1/projects/all', '/projects'];
    let lastErr: unknown;
    for (const path of paths) {
      try {
        raw = await tryFetch(path);
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!raw) {
      throw lastErr instanceof Error ? lastErr : new Error('Failed to fetch projects');
    }

    // Normalize into Project[] with safe field access
    const projects: Project[] = raw.map((item) => {
      const rec = isRecord(item) ? item : {};
      const startRaw = rec.startDate ?? rec.start_date ?? rec.startedAt;
      const endRaw = rec.endDate ?? rec.end_date ?? rec.endedAt;
      const startDate = startRaw instanceof Date ? startRaw : new Date(String(startRaw ?? Date.now()));
      const endDate = endRaw ? (endRaw instanceof Date ? endRaw : new Date(String(endRaw))) : undefined;

      const imageRaw = rec.imageUrl ?? rec.image_url ?? rec.image;
      const statusRaw = rec.status;
      const linkRaw = rec.projectLink ?? rec.link ?? rec.url;

      return {
        id: String(rec.id ?? ''),
        title: String(rec.title ?? ''),
        description: String(rec.description ?? ''),
        imageUrl: typeof imageRaw === 'string' ? imageRaw : '',
        isPinned: Boolean(rec.isPinned ?? rec.pinned ?? false),
        startDate,
        endDate,
        status: typeof statusRaw === 'string' ? statusRaw : undefined,
        projectLink: typeof linkRaw === 'string' ? linkRaw : undefined,
      } satisfies Project;
    });

    return projects;
  }
}
