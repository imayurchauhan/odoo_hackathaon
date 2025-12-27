require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const User = require('./models/User');
const Team = require('./models/Team');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const run = async () => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Collections in DB:\n');
    for (const c of collections) console.log('-', c.name);

    const usersCount = await User.countDocuments();
    const teamsCount = await Team.countDocuments();
    const equipmentCount = await Equipment.countDocuments();
    const reqCount = await MaintenanceRequest.countDocuments();

    console.log(`\nCounts:`);
    console.log(` users: ${usersCount}`);
    console.log(` teams: ${teamsCount}`);
    console.log(` equipment: ${equipmentCount}`);
    console.log(` maintenance_requests: ${reqCount}\n`);

    const sampleUsers = await User.find().limit(10).select('email role name').lean();
    console.log('Sample users:');
    console.table(sampleUsers);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
