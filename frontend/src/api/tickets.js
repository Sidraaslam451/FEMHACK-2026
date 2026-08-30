import api from './axios.js';

export const createTicket = (data) => api.post('/api/tickets', data);
export const getTickets = () => api.get('/api/tickets');
export const getTicketById = (id) => api.get(`/api/tickets/${id}`);
export const assignTicket = (id) => api.patch(`/api/tickets/${id}/assign`);
export const updateTicketStatus = (id, status) =>
  api.patch(`/api/tickets/${id}/status`, { status });
export const resolveTicket = (id, resolutionNote) =>
  api.patch(`/api/tickets/${id}/resolve`, { resolutionNote });
export const reopenTicket = (id) => api.patch(`/api/tickets/${id}/reopen`);
export const reviewAiSuggestion = (id, category, priority) =>
  api.patch(`/api/tickets/${id}/review-ai`, { category, priority });

export const getMessages = (ticketId) => api.get(`/api/tickets/${ticketId}/messages`);
export const addMessage = (ticketId, text) =>
  api.post(`/api/tickets/${ticketId}/messages`, { text });