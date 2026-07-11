import { NumberOfEntries, Visa, VisaStatus } from '../../entities/visa.entity';
import { computeStatus } from '../utils/compute-status';

export interface VisaPublicResponse {
  id: number;
  applicantName: string;
  passportNumber: string;
  evisaNumber: string;
  nationality: string | null;
  visaType: string | null;
  numberOfEntries: NumberOfEntries;
  status: VisaStatus;
  submittedOn: string | null;
  visaIssuedOn: string | null;
  visaValidFrom: string | null;
  visaValidUntil: string | null;
  durationOfStayDays: number | null;
  issuedBy: string | null;
  referenceNumber: string | null;
}

export function toPublicVisaResponse(visa: Visa): VisaPublicResponse {
  return {
    id: visa.id,
    applicantName: visa.applicantName,
    passportNumber: visa.passportNumber,
    evisaNumber: visa.evisaNumber,
    nationality: visa.nationality,
    visaType: visa.visaType,
    numberOfEntries: visa.numberOfEntries,
    status: computeStatus(visa),
    submittedOn: visa.submittedOn,
    visaIssuedOn: visa.visaIssuedOn,
    visaValidFrom: visa.visaValidFrom,
    visaValidUntil: visa.visaValidUntil,
    durationOfStayDays: visa.durationOfStayDays,
    issuedBy: visa.issuedBy,
    referenceNumber: visa.referenceNumber,
  };
}
