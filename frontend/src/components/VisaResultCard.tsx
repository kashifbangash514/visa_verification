import type { VisaPublicResponse } from '../types/visa';
import StatusSeal from './StatusSeal';
import './VisaResultCard.css';

interface VisaResultCardProps {
  visa: VisaPublicResponse;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

function display(value: string | null | undefined): string {
  return value && value.length > 0 ? value : '—';
}

function formatEntries(value: VisaPublicResponse['numberOfEntries']): string {
  return value === 'MULTIPLE' ? 'Multiple' : 'Single';
}

function formatDuration(days: number | null): string {
  if (days === null || days === undefined) {
    return '—';
  }
  return `${days} day${days === 1 ? '' : 's'}`;
}

export default function VisaResultCard({ visa }: VisaResultCardProps) {
  const fields: { label: string; value: string }[] = [
    { label: 'Applicant Name', value: display(visa.applicantName) },
    { label: 'Passport Number', value: display(visa.passportNumber) },
    { label: 'E-Visa Number', value: display(visa.evisaNumber) },
    { label: 'Nationality', value: display(visa.nationality) },
    { label: 'Visa Type', value: display(visa.visaType) },
    { label: 'Number of Entries', value: formatEntries(visa.numberOfEntries) },
    { label: 'Submitted On', value: display(visa.submittedOn) },
    { label: 'Visa Issued On', value: display(visa.visaIssuedOn) },
    { label: 'Visa Valid From', value: display(visa.visaValidFrom) },
    { label: 'Visa Valid Until', value: display(visa.visaValidUntil) },
    { label: 'Duration of Stay', value: formatDuration(visa.durationOfStayDays) },
    { label: 'Issued By', value: display(visa.issuedBy) },
    { label: 'Reference Number', value: display(visa.referenceNumber) },
  ];

  return (
    <div className="visa-card">
      <StatusSeal status={visa.status} animate />
      <div className="visa-card__grid">
        {fields.map((field) => (
          <div className="visa-field" key={field.label}>
            <span className="visa-field__label">{field.label}</span>
            <span className="visa-field__value">{field.value}</span>
          </div>
        ))}
      </div>
      <a
        className="visa-card__download"
        href={`${API_BASE_URL}/visas/${visa.id}/download`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View VISA PDF
      </a>
    </div>
  );
}
