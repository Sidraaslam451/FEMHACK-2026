import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import mongoose from "mongoose";

dotenv.config();

const seedUsers = [
  {
    name: "Demo Customer",
    email: "customer@demo.com",
    password: "password123",
    role: "customer",
  },
  {
    name: "Demo Agent",
    email: "agent@demo.com",
    password: "password123",
    role: "agent",
  },
];

const runSeed = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, seeding...");

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        existing.role = userData.role;
        await existing.save();
        console.log(
          `Updated existing user: ${userData.email} (role: ${userData.role})`,
        );
      } else {
        await User.create(userData);
        console.log(`Created user: ${userData.email} (role: ${userData.role})`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
