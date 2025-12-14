import axios from 'axios';

const resolveBaseURL = () => {
      const raw = import.meta.env.VITE_API_BASE_URL?.trim();

      if (raw) {
            try {
                  const normalized = raw.replace(/\s+/g, '');
                  const hasProtocol = /^https?:\/\//i.test(normalized) || normalized.startsWith('//');
                  const url = hasProtocol
                        ? new URL(normalized)
                        : new URL(normalized, 'https://');

                  if (url.pathname === '/' || url.pathname === '') {
                        url.pathname = '/api';
                  }

                  return url.toString().replace(/\/$/, '');
            } catch {
                  // Fallback to localhost if the provided value cannot be parsed
                  return 'http://localhost:5001/api';
            }
      }

      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            return `${window.location.origin.replace(/\/$/, '')}/api`;
      }

      return 'http://localhost:5001/api';
};

const api = axios.create({
      baseURL: resolveBaseURL(),
      headers: {
            'Content-Type': 'application/json',
      },
});

api.interceptors.request.use(
      (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      },
      (error) => Promise.reject(error)
);

export default api;
