import axios from 'axios';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import apiClient from '../api/axiosClient';
import type { NumberOfEntries, VisaAdminResponse, VisaStatus } from '../types/visa';
import Spinner from './Spinner';
import './AdminVisaForm.css';

interface AdminVisaFormProps {
  onCreated: (visa: VisaAdminResponse) => void;
  onCancel: () => void;
}

interface TextFormState {
  applicantName: string;
  passportNumber: string;
  evisaNumber: string;
  nationality: string;
  visaType: string;
  numberOfEntries: NumberOfEntries;
  status: VisaStatus;
  issuedBy: string;
  referenceNumber: string;
  submittedOn: string;
  visaIssuedOn: string;
  visaValidFrom: string;
  visaValidUntil: string;
  durationOfStayDays: string;
}

const INITIAL_STATE: TextFormState = {
  applicantName: '',
  passportNumber: '',
  evisaNumber: '',
  nationality: '',
  visaType: '',
  numberOfEntries: 'SINGLE',
  status: 'VALID',
  issuedBy: '',
  referenceNumber: '',
  submittedOn: '',
  visaIssuedOn: '',
  visaValidFrom: '',
  visaValidUntil: '',
  durationOfStayDays: '',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const VISA_PDF_TYPES = ['application/pdf'];
const PHOTO_TYPES = ['image/jpeg', 'image/png'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function validateFile(file: File | null, allowedTypes: string[], label: string): string | null {
  if (!file) {
    return null;
  }
  if (!allowedTypes.includes(file.type)) {
    return `${label} has an unsupported file type.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${label} must be 5MB or smaller.`;
  }
  return null;
}

export default function AdminVisaForm({ onCreated, onCancel }: AdminVisaFormProps) {
  const [fields, setFields] = useState<TextFormState>(INITIAL_STATE);
  const [visaPdf, setVisaPdf] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [supportingDocument, setSupportingDocument] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof TextFormState>(key: K, value: TextFormState[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) {
    setter(event.target.files?.[0] ?? null);
  }

  function resetForm() {
    setFields(INITIAL_STATE);
    setVisaPdf(null);
    setPhoto(null);
    setSupportingDocument(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fields.applicantName.trim() || !fields.passportNumber.trim() || !fields.evisaNumber.trim()) {
      setError('Applicant name, passport number, and e-visa number are required.');
      return;
    }

    const visaPdfError = validateFile(visaPdf, VISA_PDF_TYPES, 'Visa PDF');
    const photoError = validateFile(photo, PHOTO_TYPES, 'Photo');
    const documentError = validateFile(supportingDocument, DOCUMENT_TYPES, 'Supporting document');

    if (!visaPdf) {
      setError('A Visa PDF file is required.');
      return;
    }
    if (visaPdfError || photoError || documentError) {
      setError(visaPdfError || photoError || documentError);
      return;
    }

    const formData = new FormData();
    formData.append('applicantName', fields.applicantName.trim());
    formData.append('passportNumber', fields.passportNumber.trim());
    formData.append('evisaNumber', fields.evisaNumber.trim());
    formData.append('numberOfEntries', fields.numberOfEntries);
    formData.append('status', fields.status);

    const optionalText: [keyof TextFormState, string][] = [
      ['nationality', fields.nationality],
      ['visaType', fields.visaType],
      ['issuedBy', fields.issuedBy],
      ['referenceNumber', fields.referenceNumber],
      ['submittedOn', fields.submittedOn],
      ['visaIssuedOn', fields.visaIssuedOn],
      ['visaValidFrom', fields.visaValidFrom],
      ['visaValidUntil', fields.visaValidUntil],
      ['durationOfStayDays', fields.durationOfStayDays],
    ];

    for (const [key, value] of optionalText) {
      if (value.trim().length > 0) {
        formData.append(key, value.trim());
      }
    }

    formData.append('visaPdf', visaPdf);
    if (photo) {
      formData.append('photo', photo);
    }
    if (supportingDocument) {
      formData.append('document', supportingDocument);
    }

    setError(null);
    setSubmitting(true);

    try {
      const { data } = await apiClient.post<VisaAdminResponse>('/visas', formData);
      resetForm();
      onCreated(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const message = err.response.data.message;
        setError(Array.isArray(message) ? message.join(' ') : String(message));
      } else {
        setError('Unable to create the visa record. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="visa-form" onSubmit={handleSubmit} noValidate>
      <h2>Add New Visa Record</h2>

      <fieldset className="visa-form__section">
        <legend>Applicant Info</legend>
        <div className="visa-form__grid">
          <label className="visa-form__field">
            <span>Applicant Name *</span>
            <input
              type="text"
              value={fields.applicantName}
              onChange={(event) => updateField('applicantName', event.target.value)}
              required
            />
          </label>
          <label className="visa-form__field">
            <span>Passport Number *</span>
            <input
              type="text"
              value={fields.passportNumber}
              onChange={(event) => updateField('passportNumber', event.target.value)}
              required
            />
          </label>
          <label className="visa-form__field">
            <span>E-Visa Number *</span>
            <input
              type="text"
              value={fields.evisaNumber}
              onChange={(event) => updateField('evisaNumber', event.target.value)}
              required
            />
          </label>
          <label className="visa-form__field">
            <span>Nationality</span>
            <input
              type="text"
              value={fields.nationality}
              onChange={(event) => updateField('nationality', event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="visa-form__section">
        <legend>Visa Details</legend>
        <div className="visa-form__grid">
          <label className="visa-form__field">
            <span>Visa Type</span>
            <input
              type="text"
              value={fields.visaType}
              onChange={(event) => updateField('visaType', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Number of Entries</span>
            <select
              value={fields.numberOfEntries}
              onChange={(event) => updateField('numberOfEntries', event.target.value as NumberOfEntries)}
            >
              <option value="SINGLE">Single</option>
              <option value="MULTIPLE">Multiple</option>
            </select>
          </label>
          <label className="visa-form__field">
            <span>Status Override</span>
            <select value={fields.status} onChange={(event) => updateField('status', event.target.value as VisaStatus)}>
              <option value="VALID">Valid</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </label>
          <label className="visa-form__field">
            <span>Issued By</span>
            <input
              type="text"
              value={fields.issuedBy}
              onChange={(event) => updateField('issuedBy', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Reference Number</span>
            <input
              type="text"
              value={fields.referenceNumber}
              onChange={(event) => updateField('referenceNumber', event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="visa-form__section">
        <legend>Validity Dates</legend>
        <div className="visa-form__grid">
          <label className="visa-form__field">
            <span>Submitted On</span>
            <input
              type="date"
              value={fields.submittedOn}
              onChange={(event) => updateField('submittedOn', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Visa Issued On</span>
            <input
              type="date"
              value={fields.visaIssuedOn}
              onChange={(event) => updateField('visaIssuedOn', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Visa Valid From</span>
            <input
              type="date"
              value={fields.visaValidFrom}
              onChange={(event) => updateField('visaValidFrom', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Visa Valid Until</span>
            <input
              type="date"
              value={fields.visaValidUntil}
              onChange={(event) => updateField('visaValidUntil', event.target.value)}
            />
          </label>
          <label className="visa-form__field">
            <span>Duration of Stay (days)</span>
            <input
              type="number"
              min={0}
              value={fields.durationOfStayDays}
              onChange={(event) => updateField('durationOfStayDays', event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="visa-form__section">
        <legend>Files</legend>
        <div className="visa-form__grid">
          <label className="visa-form__field">
            <span>Visa PDF * (PDF, max 5MB)</span>
            <input type="file" accept="application/pdf" onChange={(event) => handleFileInput(event, setVisaPdf)} required />
          </label>
          {/* Temporarily hidden - re-enable when ready to accept these uploads again.
          <label className="visa-form__field">
            <span>Photo (JPEG/PNG, max 5MB)</span>
            <input type="file" accept="image/jpeg,image/png" onChange={(event) => handleFileInput(event, setPhoto)} />
          </label>
          <label className="visa-form__field">
            <span>Supporting Document (max 5MB)</span>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,.doc,.docx"
              onChange={(event) => handleFileInput(event, setSupportingDocument)}
            />
          </label>
          */}
        </div>
      </fieldset>

      {error && (
        <p className="visa-form__message visa-form__message--error" role="alert">
          {error}
        </p>
      )}

      <div className="visa-form__actions">
        <button type="button" className="visa-form__cancel" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="visa-form__submit" disabled={submitting}>
          {submitting && <Spinner size="small" tone="light" />}
          {submitting ? 'Saving…' : 'Add Visa Record'}
        </button>
      </div>
    </form>
  );
}
