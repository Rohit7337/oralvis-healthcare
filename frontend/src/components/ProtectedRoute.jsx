import { Navigate } from 'react-router-dom';
import { isAuthed, getRole } from '../auth';

export default function ProtectedRoute({ children, role }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (role && getRole() !== role) return <Navigate to="/login" replace />;
  return children;
}
