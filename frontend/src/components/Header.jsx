import { Link, useNavigate } from 'react-router-dom';
import { logout, getRole } from '../auth';

export default function Header() {
  const nav = useNavigate();
  const role = getRole();

  const onLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <header style={{ padding: 12, display: 'flex', gap: 16, borderBottom: '1px solid #eee' }}>
      <strong>OralVis Healthcare</strong>
      {role === 'technician' && <Link to="/tech">Upload</Link>}
      {role === 'dentist' && <Link to="/dentist">Scans</Link>}
      <span style={{ marginLeft: 'auto' }} />
      <button onClick={onLogout}>Logout</button>
    </header>
  );
}
