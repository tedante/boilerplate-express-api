const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Role = require('./models/Role');

dotenv.config();
const connectDB = require('./config/db');

connectDB();

const seedRolesAndUsers = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Role.deleteMany();

    // Create roles
    const roles = await Role.insertMany([
      { name: 'Admin' },
      { name: 'User' }
    ]);

    // Create users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      users.push({
        username: `user${i + 1}`,
        password: hashedPassword,
        role: roles[i % roles.length]._id
      });
    }

    await User.insertMany(users);

    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRolesAndUsers();