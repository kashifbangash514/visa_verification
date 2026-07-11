import { Visa, VisaStatus } from '../../entities/visa.entity';
import { computeStatus } from '../utils/compute-status';

export type VisaAdminResponse = Visa & { computedStatus: VisaStatus };

export function toAdminVisaResponse(visa: Visa): VisaAdminResponse {
  return {
    ...visa,
    computedStatus: computeStatus(visa),
  };
}
