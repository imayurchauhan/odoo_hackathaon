const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  type: { type: String, enum: ['preventive', 'corrective'], default: 'corrective' },
  status: { type: String, enum: ['new', 'in_progress', 'repaired', 'scrap'], default: 'new' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  scheduledAt: { type: Date },
  dueAt: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
}, { collection: 'maintenance_requests' });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
