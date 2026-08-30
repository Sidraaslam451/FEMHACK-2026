import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },

    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    category: {
      type: String,
      enum: ['Billing', 'Technical', 'General', 'Account', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['New', 'Assigned', 'In Progress', 'Resolved'],
      default: 'New',
    },

    aiSuggestion: {
      category: { type: String, default: null },
      priority: { type: String, default: null },
      summary: { type: String, default: null },
      generatedAt: { type: Date, default: null },
      failed: { type: Boolean, default: false },
    },

    resolutionNote: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;