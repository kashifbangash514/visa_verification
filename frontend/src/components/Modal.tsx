import { useEffect, type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export default function Modal({ onClose, children, labelledBy }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-panel__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
