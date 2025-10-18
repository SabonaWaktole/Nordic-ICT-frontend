import type { Partner } from '../../domain/entities/Partner';
import type { PartnerRepository } from '../../domain/repositories/PartnerRepository';

export const getPartners = (repo: PartnerRepository): Promise<Partner[]> => repo.list();
