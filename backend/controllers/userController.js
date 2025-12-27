const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, team } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const u = await User.create({ name, email, passwordHash, role, team });
    res.status(201).json({ id: u._id, name: u.name, email: u.email, role: u.role });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().populate('team', 'name');
    res.json(users);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).populate('team');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.passwordHash = await bcrypt.hash(update.password, salt);
      delete update.password;
    }
    const u = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(u);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
