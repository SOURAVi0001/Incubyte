import axios from 'axios';

const ensureAbsoluteUrl = (value) => {
      if (!value) return value;

      if (/^https?:\/\//i.test(value)) {
            return value;
      }

      if (value.startsWith('//')) {
            return `https:${value}`;
      }

      if (value.startsWith('/')) {
            if (typeof window !== 'undefined') {
                  return new URL(value, window.location.origin).toString();
            }
            return `http://localhost:5001${value}`;
      }

      return `https://${value}`;
};

const appendApiSegment = (urlString) => {
      if (!urlString) return urlString;

      try {
            const url = new URL(urlString);
            const sanitizedPath = url.pathname.replace(/\/$/, '');

            if (!/\/api(\/|$)/i.test(sanitizedPath)) {
                  url.pathname = `${sanitizedPath}/api`;
            } else {
                  url.pathname = sanitizedPath;
            }

            return url.toString().replace(/\/$/, '');
      } catch {
            return urlString;
      }
};

const resolveBaseURL = () => {
      const raw = import.meta.env.VITE_API_BASE_URL?.trim();

      if (raw) {
            const absolute = ensureAbsoluteUrl(raw);
            if (!absolute) {
                  return undefined;
            }
            const withProtocol = absolute;
            return appendApiSegment(withProtocol);
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
