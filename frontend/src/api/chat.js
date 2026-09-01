import api from './axios.js';

export const sendChatMessage = (message) => api.post('/api/chat', { message });