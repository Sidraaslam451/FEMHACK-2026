import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  resolveTicket,
  reopenTicket,
  reviewAiSuggestion,

} from '../controllers/ticketController.js';
import { addMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.route('/').post(authorize('customer'), createTicket).get(getTickets);

router.route('/:id').get(getTicketById);

router.patch('/:id/assign', authorize('agent', 'admin'), assignTicket);
router.patch('/:id/status', authorize('agent', 'admin'), updateTicketStatus);
router.patch('/:id/resolve', authorize('agent', 'admin'), resolveTicket);
router.patch('/:id/reopen', authorize('agent', 'admin'), reopenTicket);
router.patch('/:id/review-ai', authorize('agent', 'admin'), reviewAiSuggestion);
router.route('/:id').get(getTicketById).put(updateTicket);

router.route('/:ticketId/messages').post(addMessage).get(getMessages);

export default router;