import api from './axios.js';

export const getPublicStats = () => api.get('/api/stats');