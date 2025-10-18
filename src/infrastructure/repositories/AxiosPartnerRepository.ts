import { apiClient } from '../http/apiClient';
import type { Partner } from '../../domain/entities/Partner';
import type { PartnerRepository } from '../../domain/repositories/PartnerRepository';

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

export class AxiosPartnerRepository implements PartnerRepository {
  async list(): Promise<Partner[]> {
    const tryFetch = async (path: string) => {
      const { data } = await apiClient.get<unknown>(path);
      const arr = extractArray(data);
      if (!arr) throw new Error('Unexpected partners response shape');
      return arr;
    };

    const paths = ['/v1/partners/all', '/partners'];
    let raw: Array<unknown> | null = null;
    let lastErr: unknown;
    for (const p of paths) {
      try {
        raw = await tryFetch(p);
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (!raw) throw lastErr instanceof Error ? lastErr : new Error('Failed to fetch partners');

    // Map to Partner[] conservatively
    const partners: Partner[] = raw.map((item) => {
      const rec = isRecord(item) ? item : {};
      return {
        id: String(rec.id ?? ''),
        name: String(rec.name ?? ''),
        description: String(rec.description ?? ''),
        industry: String(rec.industry ?? ''),
        website: String(rec.website ?? ''),
        email: String(rec.email ?? ''),
        phone: String(rec.phone ?? ''),
        location: String(rec.location ?? ''),
        partnershipType: (rec.partnershipType as Partner['partnershipType']) ?? 'Strategic',
        status: (rec.status as Partner['status']) ?? 'Active',
        logo: String(rec.logo ?? ''),
        joinDate: String(rec.joinDate ?? rec.join_date ?? ''),
      } satisfies Partner;
    });

    return partners;
  }
}
