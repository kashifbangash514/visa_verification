import { Navigate, Outlet } from 'react-router-dom';
import { getToken, isTokenValid } from './token';

export default function ProtectedRoute() {
  if (!isTokenValid(getToken())) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
