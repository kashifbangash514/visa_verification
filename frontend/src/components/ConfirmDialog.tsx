import Spinner from './Spinner';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'Cancel',
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-overlay" onMouseDown={onCancel}>
      <div
        className="confirm-panel"
        role="alertdialog"
        aria-modal="true"
        aria-describedby="confirm-dialog-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p id="confirm-dialog-message" className="confirm-panel__message">
          {message}
        </p>

        {error && (
          <p className="confirm-panel__error" role="alert">
            {error}
          </p>
        )}

        <div className="confirm-panel__actions">
          <button type="button" className="confirm-panel__cancel" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-panel__confirm" onClick={onConfirm} disabled={loading}>
            {loading && <Spinner size="small" tone="light" />}
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
