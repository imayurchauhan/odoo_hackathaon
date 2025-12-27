const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[auth] login attempt for: ${email}`);
    // Case-insensitive lookup to avoid issues with input casing
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (user) console.log(`[auth] user found: ${user.email} (role=${user.role})`);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log(`[auth] password check for ${email}: ${ok}`);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team, avatarUrl: user.avatarUrl } });
  } catch (err) { next(err); }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, team, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role || 'user'; // default to 'user' (normal employee), can be 'technician', 'manager', 'admin'
    const user = await User.create({ name, email, passwordHash, role: userRole, team });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team, avatarUrl: user.avatarUrl } });
  } catch (err) { next(err); }
};
