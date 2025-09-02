import { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../api';
import { jsPDF } from 'jspdf';

async function fetchAsDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const fr = new FileReader();
    fr.onloadend = () => resolve(fr.result);
    fr.readAsDataURL(blob);
  });
}

export default function DentistViewer() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/scans');
        setItems(data);
      } catch (e) {
        setMsg(e.response?.data?.error || 'Failed to load scans');
      }
    })();
  }, []);

  const downloadPdf = async (scan) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('OralVis — Scan Report', 14, 18);

      doc.setFontSize(12);
      doc.text(`Patient Name: ${scan.patient_name}`, 14, 32);
      doc.text(`Patient ID:   ${scan.patient_id}`, 14, 40);
      doc.text(`Scan Type:    ${scan.scan_type}`, 14, 48);
      doc.text(`Region:       ${scan.region}`, 14, 56);
      doc.text(`Upload Date:  ${new Date(scan.upload_date).toLocaleString()}`, 14, 64);

      const dataUrl = await fetchAsDataUrl(scan.image_url);
      // fit image nicely on A4
      doc.addImage(dataUrl, 'JPEG', 14, 76, 182, 110);

      doc.save(`scan_${scan.patient_id}_${scan.id}.pdf`);
    } catch (e) {
      alert('Failed to generate PDF');
    }
  };


    <>
      <Header />
      <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 8px' }}>
        <h2>Dentist — Scan Viewer</h2>
        {!!msg && <p style={{ color: 'crimson' }}>{msg}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {items.map((scan) => (
            <div key={scan.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <img
                src={scan.image_url}
                alt="thumbnail"
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
              />
              <div style={{ marginTop: 8, fontSize: 14 }}>
                <div><strong>{scan.patient_name}</strong> ({scan.patient_id})</div>
                <div>Type: {scan.scan_type}</div>
                <div>Region: {scan.region}</div>
                <div>Date: {new Date(scan.upload_date).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <a href={scan.image_url} target="_blank" rel="noreferrer">
                  <button>View Full Image</button>
                </a>
                <button onClick={() => downloadPdf(scan)}>Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
}
