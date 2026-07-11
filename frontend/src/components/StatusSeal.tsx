import type { VisaStatus } from '../types/visa';
import './StatusSeal.css';

interface StatusSealProps {
  status: VisaStatus;
  animate?: boolean;
}

const STATUS_COPY: Record<VisaStatus, { title: string; subtitle: string; pill: string }> = {
  VALID: { title: 'Visa Valid', subtitle: 'Status Valid — Verified', pill: 'VALID' },
  EXPIRED: { title: 'Visa Expired', subtitle: 'Status Expired — Not Valid', pill: 'EXPIRED' },
  REVOKED: { title: 'Visa Revoked', subtitle: 'Status Revoked — Not Valid', pill: 'REVOKED' },
};

export default function StatusSeal({ status, animate = false }: StatusSealProps) {
  const isValid = status === 'VALID';
  const copy = STATUS_COPY[status];

  const className = [
    'status-banner',
    isValid ? 'status-banner--positive' : 'status-banner--negative',
    animate ? 'status-banner--enter' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} role="status" aria-label={`VISA status: ${copy.title}`}>
      <span className="status-banner__icon" aria-hidden="true">
        {isValid ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        )}
      </span>
      <div className="status-banner__text">
        <p className="status-banner__title">{copy.title}</p>
        <p className="status-banner__subtitle">{copy.subtitle}</p>
      </div>
      <span className="status-banner__pill">{copy.pill}</span>
    </div>
  );
}
