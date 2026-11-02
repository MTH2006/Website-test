import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('minicaas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('minicaas_token');
      localStorage.removeItem('minicaas_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const clusterApi = {
  getStatus: () => api.get('/cluster/status'),
};

export const teamApi = {
  getAll: () => api.get('/teams'),
  getByName: (name) => api.get(`/teams/${name}`),
  updateQuota: (name, quotaData) => api.put(`/teams/${name}/quota`, quotaData),
};

export const applicationApi = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (appData) => api.post('/applications', appData),
  delete: (id) => api.delete(`/applications/${id}`),
  getLogs: (id, podName) => api.get(`/applications/${id}/pods/${podName}/logs`),
};

export const securityApi = {
  getPolicies: () => api.get('/security/policies'),
  testRbac: (params) => api.get('/security/test-rbac', { params }),
};

export const demoLabApi = {
  getTests: () => api.get('/demo-lab/tests'),
  runSingleTest: (testCode) => api.post(`/demo-lab/run-test/${testCode}`),
  runAllTests: () => api.post('/demo-lab/run-all'),
  resetDemo: () => api.post('/demo-lab/reset'),
};

export const demoHistoryApi = {
  getAllSessions: () => api.get('/demo-history'),
  getSessionDetails: (id) => api.get(`/demo-history/${id}`),
  compareSessions: (sessionA, sessionB) =>
    api.post('/demo-history/compare', null, { params: { sessionA, sessionB } }),
};

export const reportApi = {
  exportCsvUrl: (sessionId) => `/api/reports/export/csv/${sessionId}`,
  exportMarkdownUrl: (sessionId) => `/api/reports/export/markdown/${sessionId}`,
  exportCsv: (sessionId) =>
    api.get(`/reports/export/csv/${sessionId}`, { responseType: 'blob' }),
  exportMarkdown: (sessionId) =>
    api.get(`/reports/export/markdown/${sessionId}`, { responseType: 'blob' }),
};

export const systemApi = {
  getHealth: () => api.get('/system/health'),
  getSettings: () => api.get('/system/settings'),
};

export default api;
