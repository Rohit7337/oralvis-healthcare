import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechnicianUpload from './pages/TechnicianUpload';
import DentistViewer from './pages/DentistViewer';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/tech"
          element={
            <ProtectedRoute role="technician">
              <TechnicianUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dentist"
          element={
            <ProtectedRoute role="dentist">
              <DentistViewer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
