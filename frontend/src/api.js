import axios from 'axios';

const raw = import.meta.env.VITE_API_URL;
// Fallback so we never end up with ":5050" again
const baseURL = (raw && raw.startsWith('http'))
  ? raw
  : 'http://localhost:5050/api';

console.log('API baseURL ->', baseURL);

const api = axios.create({ baseURL });

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
