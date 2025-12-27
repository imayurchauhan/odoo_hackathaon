const Team = require('../models/Team');

exports.create = async (req, res, next) => {
  try {
    const t = await Team.create(req.body);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Team.find().populate('members');
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const t = await Team.findById(req.params.id).populate('members');
    if (!t) return res.status(404).json({ message: 'Team not found' });
    res.json(t);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const t = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
