import type { VisaAdminResponse } from '../types/visa';
import './AdminVisaTable.css';

interface AdminVisaTableProps {
  visas: VisaAdminResponse[];
  onDeleteRequest: (visa: VisaAdminResponse) => void;
}

function display(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? '—' : String(value);
}

export default function AdminVisaTable({ visas, onDeleteRequest }: AdminVisaTableProps) {
  if (visas.length === 0) {
    return <p className="visa-table__empty">No visa records yet. Use "Add" above to create the first one.</p>;
  }

  return (
    <div className="visa-table-wrapper">
      <table className="visa-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Applicant Name</th>
            <th>Passport No.</th>
            <th>E-Visa No.</th>
            <th>Nationality</th>
            <th>Visa Type</th>
            <th>Entries</th>
            <th>Status</th>
            <th>Valid From</th>
            <th>Valid Until</th>
            <th>Reference No.</th>
            <th>Created</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {visas.map((visa) => (
            <tr key={visa.id}>
              <td>{visa.id}</td>
              <td>{display(visa.applicantName)}</td>
              <td className="visa-table__mono">{display(visa.passportNumber)}</td>
              <td className="visa-table__mono">{display(visa.evisaNumber)}</td>
              <td>{display(visa.nationality)}</td>
              <td>{display(visa.visaType)}</td>
              <td>{visa.numberOfEntries === 'MULTIPLE' ? 'Multiple' : 'Single'}</td>
              <td>
                <span className={`visa-table__status visa-table__status--${visa.computedStatus.toLowerCase()}`}>
                  {visa.computedStatus}
                </span>
              </td>
              <td className="visa-table__mono">{display(visa.visaValidFrom)}</td>
              <td className="visa-table__mono">{display(visa.visaValidUntil)}</td>
              <td className="visa-table__mono">{display(visa.referenceNumber)}</td>
              <td className="visa-table__mono">{display(visa.createdAt.slice(0, 10))}</td>
              <td>
                <button
                  type="button"
                  className="visa-table__delete"
                  onClick={() => onDeleteRequest(visa)}
                  aria-label={`Delete visa record for ${visa.applicantName}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
