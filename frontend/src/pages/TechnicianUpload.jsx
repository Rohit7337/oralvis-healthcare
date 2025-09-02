import { useState } from 'react';
import api from '../api';
import Header from '../components/Header';

export default function TechnicianUpload() {
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    scanType: 'RGB',
    region: 'Frontal'
  });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', image);

      const { data } = await api.post('/scans', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMsg(`Uploaded. ID: ${data.id}`);
      setForm({ patientName: '', patientId: '', scanType: 'RGB', region: 'Frontal' });
      setImage(null);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 640, margin: '24px auto' }}>
        <h2>Technician — Upload Scan</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input name="patientName" placeholder="Patient Name" value={form.patientName} onChange={onChange} required />
          <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={onChange} required />
          <select name="scanType" value={form.scanType} onChange={onChange}>
            <option>RGB</option>
          </select>
          <select name="region" value={form.region} onChange={onChange}>
            <option>Frontal</option>
            <option>Upper Arch</option>
            <option>Lower Arch</option>
          </select>
          <input type="file" accept="image/png,image/jpeg" onChange={e => setImage(e.target.files?.[0])} required />
          <button type="submit">Upload</button>
        </form>
        {!!msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </>
  );
}
