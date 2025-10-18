import { apiClient } from '../http/apiClient';
import type { Partner } from '../../domain/entities/Partner';
import type { PartnerRepository } from '../../domain/repositories/PartnerRepository';

export class AxiosPartnerRepository implements PartnerRepository {
  async list(): Promise<Partner[]> {
    // GET /api/v1/partners
    const { data } = await apiClient.get<Partner[]>('/v1/partners');
    return data;
  }
}
