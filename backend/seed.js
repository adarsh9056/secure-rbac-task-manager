require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const seedUsers = async () => {
  await connectDB();

  const seedData = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin123",
      role: "admin"
    },
    {
      name: "Normal User",
      email: "user@example.com",
      password: "User123",
      role: "user"
    }
  ];

  for (const user of seedData) {
    const existing = await User.findOne({ email: user.email });
    if (existing) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role
    });
  }

  console.log("Seed completed: admin@example.com and user@example.com are ready.");
  await mongoose.connection.close();
};

seedUsers().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});
