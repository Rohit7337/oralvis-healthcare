import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setAuth } from '../auth';

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('tech@oralvis.com');   // defaults to seeded users
  const [password, setPassword] = useState('tech123');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data);
      nav(data.role === 'technician' ? '/tech' : '/dentist');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '64px auto' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
      {!!msg && <p style={{ color: 'crimson' }}>{msg}</p>}
      <p style={{ marginTop: 10, fontSize: 14 }}>
        Demo users: <code>tech@oralvis.com / tech123</code>, <code>dentist@oralvis.com / dent123</code>
      </p>
    </div>
  );
}
