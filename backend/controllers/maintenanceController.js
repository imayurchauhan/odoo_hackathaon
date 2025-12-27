const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// Create request: auto-fill team from equipment
exports.create = async (req, res, next) => {
  try {
    const payload = req.body;
    const equipment = await Equipment.findById(payload.equipment);
    if (!equipment) return res.status(400).json({ message: 'Invalid equipment' });

    // auto-fill team
    if (equipment.team) payload.team = equipment.team;

    const mr = await MaintenanceRequest.create({ ...payload, createdBy: req.user?.id });
    res.status(201).json(mr);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.team) filter.team = req.query.team;
    if (req.query.status) filter.status = req.query.status;
    const items = await MaintenanceRequest.find(filter).populate('equipment team assignedTo createdBy');
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const mr = await MaintenanceRequest.findById(req.params.id).populate('equipment team assignedTo createdBy');
    if (!mr) return res.status(404).json({ message: 'Request not found' });
    res.json(mr);
  } catch (err) { next(err); }
};

// Update includes workflow transitions and scrap logic
exports.update = async (req, res, next) => {
  try {
    const mr = await MaintenanceRequest.findById(req.params.id);
    if (!mr) return res.status(404).json({ message: 'Request not found' });

    const prevStatus = mr.status;
    Object.assign(mr, req.body);

    // If moving to scrap, mark equipment scrapped
    if (prevStatus !== 'scrap' && mr.status === 'scrap') {
      if (mr.equipment) {
        await Equipment.findByIdAndUpdate(mr.equipment, { isScrapped: true });
      }
    }

    // If moved to repaired, set completedAt and update equipment lastMaintenanceAt
    if (mr.status === 'repaired' && !mr.completedAt) {
      mr.completedAt = new Date();
      if (mr.equipment) await Equipment.findByIdAndUpdate(mr.equipment, { lastMaintenanceAt: mr.completedAt });
    }

    await mr.save();
    const populated = await MaintenanceRequest.findById(mr._id).populate('equipment team assignedTo createdBy');
    res.json(populated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await MaintenanceRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

// Endpoint for technician to pick a request — enforce team membership
exports.pick = async (req, res, next) => {
  try {
    const mr = await MaintenanceRequest.findById(req.params.id).populate('team');
    if (!mr) return res.status(404).json({ message: 'Request not found' });
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Auth required' });

    // only technicians of assigned team can pick
    if (user.role !== 'technician' || String(user.team) !== String(mr.team?._id)) {
      return res.status(403).json({ message: 'Not authorized to pick this request' });
    }

    mr.assignedTo = user.id;
    mr.status = 'in_progress';
    await mr.save();
    res.json(mr);
  } catch (err) { next(err); }
};
