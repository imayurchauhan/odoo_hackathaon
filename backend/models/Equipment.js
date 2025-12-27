const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  isScrapped: { type: Boolean, default: false },
  lastMaintenanceAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'equipment' });

module.exports = mongoose.model('Equipment', EquipmentSchema);
