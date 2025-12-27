require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');
const Team = require('./models/Team');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seeding database...');
    
    // Create Teams
    const teams = await Team.create([
      { name: 'Team Alpha', description: 'Production floor maintenance' },
      { name: 'Team Beta', description: 'Manufacturing equipment' },
      { name: 'Team Gamma', description: 'Hydraulics and precision tools' }
    ]);
    console.log('✅ Teams created');
    
    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@gearguard.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'admin',
        team: teams[0]._id
      },
      {
        name: 'Mike Johnson',
        email: 'mike@gearguard.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'technician',
        team: teams[0]._id
      },
      {
        name: 'Sarah Lee',
        email: 'sarah@gearguard.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'technician',
        team: teams[1]._id
      },
      {
        name: 'James Park',
        email: 'james@gearguard.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'technician',
        team: teams[2]._id
      }
    ]);
    console.log('✅ Users created');
    
    // Create Equipment
    const equipment = await Equipment.create([
      { name: 'Pump Motor A', code: 'PM-001', location: 'Building A, Floor 2', team: teams[0]._id },
      { name: 'Drill Press B', code: 'DP-002', location: 'Building B, Floor 1', team: teams[1]._id },
      { name: 'Lathe C', code: 'LC-003', location: 'Building A, Floor 3', team: teams[2]._id }
    ]);
    console.log('✅ Equipment created');
    
    // Create Maintenance Requests
    await MaintenanceRequest.create([
      {
        title: 'Pump Motor A - Bearing Replacement',
        description: 'Replace worn bearing',
        equipment: equipment[0]._id,
        type: 'corrective',
        status: 'in_progress',
        priority: 'high',
        team: teams[0]._id,
        assignedTo: users[1]._id,
        createdBy: users[0]._id,
        dueAt: new Date(Date.now() + 2*24*60*60*1000)
      },
      {
        title: 'Drill Press B - Calibration',
        description: 'Calibrate precision',
        equipment: equipment[1]._id,
        type: 'preventive',
        status: 'new',
        priority: 'medium',
        team: teams[1]._id,
        createdBy: users[0]._id,
        scheduledAt: new Date(Date.now() + 7*24*60*60*1000)
      },
      {
        title: 'Lathe C - Oil Refill',
        description: 'Refill hydraulic oil',
        equipment: equipment[2]._id,
        type: 'preventive',
        status: 'new',
        priority: 'low',
        team: teams[2]._id,
        createdBy: users[0]._id
      }
    ]);
    console.log('✅ Maintenance Requests created');
    
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Sample Login Credentials:');
    console.log('  Admin: admin@gearguard.com / password123');
    console.log('  Tech:  mike@gearguard.com / password123\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
