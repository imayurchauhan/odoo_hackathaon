const Equipment = require('../models/Equipment');

exports.create = async (req, res, next) => {
  try {
    const eq = await Equipment.create(req.body);
    res.status(201).json(eq);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Equipment.find().populate('team');
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const eq = await Equipment.findById(req.params.id).populate('team');
    if (!eq) return res.status(404).json({ message: 'Equipment not found' });
    res.json(eq);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const eq = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('team');
    if (!eq) return res.status(404).json({ message: 'Equipment not found' });
    res.json(eq);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
