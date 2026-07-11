export type NumberOfEntries = 'SINGLE' | 'MULTIPLE';
export type VisaStatus = 'VALID' | 'EXPIRED' | 'REVOKED';

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

export interface VisaAdminResponse {
  id: number;
  applicantName: string;
  passportNumber: string;
  evisaNumber: string;
  nationality: string | null;
  visaType: string | null;
  numberOfEntries: NumberOfEntries;
  status: VisaStatus;
  computedStatus: VisaStatus;
  submittedOn: string | null;
  visaIssuedOn: string | null;
  visaValidFrom: string | null;
  visaValidUntil: string | null;
  durationOfStayDays: number | null;
  issuedBy: string | null;
  referenceNumber: string | null;
  visaPdfPath: string;
  photoPath: string | null;
  documentPath: string | null;
  createdAt: string;
}
