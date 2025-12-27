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
    const user = req.user;

    // Role-based filtering
    if (user.role === 'technician') {
      // Technicians see only requests for their team
      filter.team = user.team;
    } else if (user.role === 'user' || user.role === 'employee') {
      // Normal users see only requests they created
      filter.createdBy = user.id;
    }
    // managers and admins see all requests

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

    const user = req.user;
    const prevStatus = mr.status;

    // Technicians can only update requests for their team
    if (user.role === 'technician' && String(user.team) !== String(mr.team)) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Strict status flow enforcement for technicians
    if (user.role === 'technician' && req.body.status) {
      const newStatus = req.body.status;
      // Only allow valid transitions
      const allowed = {
        new: ['in_progress'],
        in_progress: ['repaired']
      };
      const allowedNext = allowed[prevStatus] || [];
      if (!allowedNext.includes(newStatus)) {
        return res.status(400).json({ message: `Invalid status transition: ${prevStatus} -> ${newStatus}` });
      }
      // If marking in_progress or repaired, ensure the technician is assigned
      if (newStatus === 'in_progress' || newStatus === 'repaired') {
        if (!mr.assignedTo || String(mr.assignedTo) !== String(user.id)) {
          return res.status(403).json({ message: 'Only assigned technician can change status to in_progress or repaired' });
        }
      }
    }

    // Merge allowed fields
    const allowedFields = ['status','title','description','priority','scheduledAt','dueAt','duration'];
    for (const k of Object.keys(req.body)) {
      if (allowedFields.includes(k)) mr[k] = req.body[k];
    }

    // If moving to scrap, mark equipment scrapped
    if (prevStatus !== 'scrap' && mr.status === 'scrap') {
      if (mr.equipment) {
        await Equipment.findByIdAndUpdate(mr.equipment, { isScrapped: true });
      }
    }

    // If moved to repaired, set completedAt, record duration and update equipment lastMaintenanceAt
    if (mr.status === 'repaired' && !mr.completedAt) {
      // duration must be provided
      if (!mr.duration) return res.status(400).json({ message: 'Duration is required when marking as repaired' });
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
