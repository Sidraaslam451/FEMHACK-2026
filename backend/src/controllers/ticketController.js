import Ticket from "../models/Ticket.js";
import generateTicketNumber from "../utils/generateTicketNumber.js";
import { triageTicket } from "../services/aiTriageService.js";

export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category } = req.body;

    if (!subject || !description) {
      const err = new Error("Subject and description are required");
      err.statusCode = 400;
      throw err;
    }

    const aiResult = await triageTicket(subject, description);

    const ticket = await Ticket.create({
      ticketNumber: generateTicketNumber(),
      subject,
      description,
      category: category || "Other",
      customer: req.user._id,
      status: "New",
      aiSuggestion: {
        category: aiResult.category,
        priority: aiResult.priority,
        summary: aiResult.summary,
        generatedAt: new Date(),
        failed: aiResult.failed,
      },
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    } else if (req.user.role === "agent") {
      // agent sees unassigned tickets + tickets assigned to them
      filter.$or = [{ assignedAgent: req.user._id }, { assignedAgent: null }];
    }
    // admin sees everything, no filter

    const tickets = await Ticket.find(filter)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email");

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    const isOwner = ticket.customer._id.toString() === req.user._id.toString();
    const isAssignedAgent =
      ticket.assignedAgent &&
      ticket.assignedAgent._id.toString() === req.user._id.toString();
    const isAgentOrAdmin =
      req.user.role === "agent" || req.user.role === "admin";

    if (req.user.role === "customer" && !isOwner) {
      const err = new Error("Not authorized to view this ticket");
      err.statusCode = 403;
      throw err;
    }

    if (req.user.role === "agent" && ticket.assignedAgent && !isAssignedAgent) {
      const err = new Error("Not authorized to view this ticket");
      err.statusCode = 403;
      throw err;
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    if (ticket.status === "Resolved") {
      const err = new Error("Cannot assign a resolved ticket");
      err.statusCode = 400;
      throw err;
    }

    ticket.assignedAgent = req.user._id;
    ticket.status = "Assigned";
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Assigned", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      const err = new Error("Invalid status value");
      err.statusCode = 400;
      throw err;
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    if (ticket.status === "Resolved") {
      const err = new Error(
        "Resolved ticket cannot be changed. Reopen it first.",
      );
      err.statusCode = 400;
      throw err;
    }

    const isAssignedAgent =
      ticket.assignedAgent &&
      ticket.assignedAgent.toString() === req.user._id.toString();

    if (req.user.role === "agent" && !isAssignedAgent) {
      const err = new Error("Only the assigned agent can update this ticket");
      err.statusCode = 403;
      throw err;
    }

    if (status === "Resolved") {
      const err = new Error(
        "Use the resolve endpoint to mark ticket as Resolved",
      );
      err.statusCode = 400;
      throw err;
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const resolveTicket = async (req, res, next) => {
  try {
    const { resolutionNote } = req.body;

    if (!resolutionNote || !resolutionNote.trim()) {
      const err = new Error("Resolution note is required to resolve a ticket");
      err.statusCode = 400;
      throw err;
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    if (ticket.status === "Resolved") {
      const err = new Error("Ticket is already resolved");
      err.statusCode = 400;
      throw err;
    }

    const isAssignedAgent =
      ticket.assignedAgent &&
      ticket.assignedAgent.toString() === req.user._id.toString();

    if (req.user.role === "agent" && !isAssignedAgent) {
      const err = new Error("Only the assigned agent can resolve this ticket");
      err.statusCode = 403;
      throw err;
    }

    ticket.status = "Resolved";
    ticket.resolutionNote = resolutionNote;
    ticket.resolvedAt = new Date();
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    if (ticket.status !== "Resolved") {
      const err = new Error("Only resolved tickets can be reopened");
      err.statusCode = 400;
      throw err;
    }

    if (req.user.role === "customer") {
      const err = new Error("Not authorized to reopen ticket");
      err.statusCode = 403;
      throw err;
    }

    ticket.status = "In Progress";
    ticket.resolutionNote = null;
    ticket.resolvedAt = null;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// backend/src/controllers/ticketController.js mein ye naya function add karo (end mein)
export const reviewAiSuggestion = async (req, res, next) => {
  try {
    const { category, priority } = req.body;

    const validCategories = [
      "Load Shedding Complaint",
      "Billing Dispute",
      "Meter Issue",
      "New Connection",
      "Voltage Fluctuation",
      "Power Outage",
      "Other",
    ];
    const validPriorities = ["Low", "Medium", "High"];

    if (!validCategories.includes(category)) {
      const err = new Error("Invalid category value");
      err.statusCode = 400;
      throw err;
    }

    if (!validPriorities.includes(priority)) {
      const err = new Error("Invalid priority value");
      err.statusCode = 400;
      throw err;
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    if (ticket.status === "Resolved") {
      const err = new Error("Cannot modify a resolved ticket");
      err.statusCode = 400;
      throw err;
    }

    ticket.category = category;
    ticket.priority = priority;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// backend/src/controllers/ticketController.js mein ye naya function add karo
export const updateTicket = async (req, res, next) => {
  try {
    const { subject, description, category } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      const err = new Error("Ticket not found");
      err.statusCode = 404;
      throw err;
    }

    const isOwner = ticket.customer.toString() === req.user._id.toString();

    if (req.user.role === "customer" && !isOwner) {
      const err = new Error("Not authorized to update this ticket");
      err.statusCode = 403;
      throw err;
    }

    if (ticket.status === "Resolved") {
      const err = new Error(
        "Resolved ticket cannot be updated. Reopen it first.",
      );
      err.statusCode = 400;
      throw err;
    }

    if (subject) ticket.subject = subject;
    if (description) ticket.description = description;
    if (category) ticket.category = category;

    if (subject || description) {
      const aiResult = await triageTicket(ticket.subject, ticket.description);
      ticket.aiSuggestion = {
        category: aiResult.category,
        priority: aiResult.priority,
        summary: aiResult.summary,
        generatedAt: new Date(),
        failed: aiResult.failed,
      };
    }

    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};
