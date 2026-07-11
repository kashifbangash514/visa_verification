import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosClient';
import AdminSidebar from '../components/AdminSidebar';
import AdminVisaForm from '../components/AdminVisaForm';
import AdminVisaTable from '../components/AdminVisaTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastContext';
import { clearToken } from '../auth/token';
import type { VisaAdminResponse } from '../types/visa';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [visas, setVisas] = useState<VisaAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<VisaAdminResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVisas() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<VisaAdminResponse[]>('/visas');
        if (isMounted) {
          setVisas(data);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load visa records.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVisas();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    clearToken();
    navigate('/admin/login', { replace: true });
  }

  function handleCreated(visa: VisaAdminResponse) {
    setVisas((previous) => [visa, ...previous]);
    setIsAddModalOpen(false);
    showToast('Visa added successfully', 'success');
  }

  function handleDeleteRequest(visa: VisaAdminResponse) {
    setDeleteTarget(visa);
    setDeleteError(null);
  }

  function handleCancelDelete() {
    if (deleting) {
      return;
    }
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await apiClient.delete(`/visas/${deleteTarget.id}`);
      setVisas((previous) => previous.filter((visa) => visa.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast('Visa deleted successfully', 'success');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const message = err.response.data.message;
        setDeleteError(Array.isArray(message) ? message.join(' ') : String(message));
      } else {
        setDeleteError('Unable to delete this record. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-shell">
      <AdminSidebar onLogout={handleLogout} />

      <main className="admin-shell__content">
        <header className="admin-content__header">
          <h1>Visas</h1>
          <button type="button" className="admin-content__add" onClick={() => setIsAddModalOpen(true)}>
            + Add
          </button>
        </header>

        {loading && (
          <div className="admin-content__loading">
            <Spinner />
            <span>Loading visa records…</span>
          </div>
        )}

        {error && (
          <p className="admin-content__error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && <AdminVisaTable visas={visas} onDeleteRequest={handleDeleteRequest} />}
      </main>

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)} labelledBy="add-visa-heading">
          <AdminVisaForm onCreated={handleCreated} onCancel={() => setIsAddModalOpen(false)} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete this record? (${deleteTarget.applicantName} — ${deleteTarget.passportNumber})`}
          loading={deleting}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
