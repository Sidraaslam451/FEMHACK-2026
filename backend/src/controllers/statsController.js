import Ticket from '../models/Ticket.js';

export const getPublicStats = async (req, res, next) => {
  try {
    const total = await Ticket.countDocuments();
    const resolved = await Ticket.countDocuments({ status: 'Resolved' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
    const newCount = await Ticket.countDocuments({ status: 'New' });

    const categories = ['Load Shedding Complaint', 'Billing Dispute', 'Meter Issue', 'New Connection', 'Voltage Fluctuation', 'Power Outage', 'Other'];
    const byCategory = await Promise.all(
      categories.map(async (c) => ({
        category: c,
        count: await Ticket.countDocuments({ category: c }),
      }))
    );

    res.status(200).json({
      success: true,
      data: { total, resolved, inProgress, new: newCount, byCategory },
    });
  } catch (error) {
    next(error);
  }
};