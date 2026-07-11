import EmblemMark from './EmblemMark';
import './AdminSidebar.css';

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <EmblemMark />
        <span className="admin-sidebar__brand-label">Admin Portal</span>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin sections">
        <button type="button" className="admin-sidebar__nav-item admin-sidebar__nav-item--active" aria-current="page">
          <span className="admin-sidebar__nav-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Visas
        </button>
      </nav>

      <button type="button" className="admin-sidebar__logout" onClick={onLogout}>
        Log Out
      </button>
    </aside>
  );
}
