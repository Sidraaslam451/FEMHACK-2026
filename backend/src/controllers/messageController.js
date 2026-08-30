import Message from '../models/Message.js';
import Ticket from '../models/Ticket.js';

export const addMessage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      const err = new Error('Message text is required');
      err.statusCode = 400;
      throw err;
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      throw err;
    }

    const isOwner = ticket.customer.toString() === req.user._id.toString();
    const isAssignedAgent =
      ticket.assignedAgent && ticket.assignedAgent.toString() === req.user._id.toString();

    if (req.user.role === 'customer' && !isOwner) {
      const err = new Error('Not authorized to message on this ticket');
      err.statusCode = 403;
      throw err;
    }

    if (req.user.role === 'agent' && !isAssignedAgent) {
      const err = new Error('Not authorized to message on this ticket');
      err.statusCode = 403;
      throw err;
    }

    const message = await Message.create({
      ticket: ticket._id,
      sender: req.user._id,
      senderRole: req.user.role,
      text,
    });

    const populatedMessage = await message.populate('sender', 'name role');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      throw err;
    }

    const isOwner = ticket.customer.toString() === req.user._id.toString();
    const isAssignedAgent =
      ticket.assignedAgent && ticket.assignedAgent.toString() === req.user._id.toString();

    if (req.user.role === 'customer' && !isOwner) {
      const err = new Error('Not authorized to view messages on this ticket');
      err.statusCode = 403;
      throw err;
    }

    if (req.user.role === 'agent' && !isAssignedAgent) {
      const err = new Error('Not authorized to view messages on this ticket');
      err.statusCode = 403;
      throw err;
    }

    const messages = await Message.find({ ticket: req.params.ticketId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};