// backend/src/clearTickets.js
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Ticket from './models/Ticket.js';
import Message from './models/Message.js';

dotenv.config();

const clearTickets = async () => {
  try {
    await connectDB();
    await Ticket.deleteMany({});
    await Message.deleteMany({});
    console.log('All tickets and messages cleared.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to clear:', error);
    process.exit(1);
  }
};

clearTickets();