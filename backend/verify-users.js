#!/usr/bin/env node

/**
 * Quick test script to verify all seeded users exist in database
 * Run: node verify-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');

const testUsers = [
  { email: 'admin@gearguard.com', role: 'admin', password: 'password123' },
  { email: 'john@gearguard.com', role: 'user', password: 'password123' },
  { email: 'jane@gearguard.com', role: 'user', password: 'password123' },
  { email: 'mike@gearguard.com', role: 'technician', password: 'password123' },
  { email: 'sarah@gearguard.com', role: 'technician', password: 'password123' },
  { email: 'james@gearguard.com', role: 'technician', password: 'password123' },
  { email: 'manager@gearguard.com', role: 'manager', password: 'password123' }
];

const verify = async () => {
  try {
    await connectDB();
    console.log('\n📋 Verifying seeded users...\n');

    for (const testUser of testUsers) {
      const user = await User.findOne({ email: testUser.email });
      
      if (!user) {
        console.log(`❌ ${testUser.email} - NOT FOUND`);
        continue;
      }

      const isPasswordValid = await bcrypt.compare(testUser.password, user.passwordHash);
      const status = isPasswordValid ? '✅' : '❌';
      console.log(`${status} ${testUser.email} (${user.role})`);
    }

    console.log('\nDone!\n');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

verify();
