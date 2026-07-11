import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { ToastProvider } from './components/ToastProvider';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PublicLookupPage from './pages/PublicLookupPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLookupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
 