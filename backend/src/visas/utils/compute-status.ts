import { Visa, VisaStatus } from '../../entities/visa.entity';

export function computeStatus(visa: Pick<Visa, 'status' | 'visaValidUntil'>): VisaStatus {
  if (visa.status === VisaStatus.REVOKED) {
    return VisaStatus.REVOKED;
  }

  if (!visa.visaValidUntil) {
    return VisaStatus.EXPIRED;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validUntil = new Date(visa.visaValidUntil);
  validUntil.setHours(0, 0, 0, 0);

  return today <= validUntil ? VisaStatus.VALID : VisaStatus.EXPIRED;
}
