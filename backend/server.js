require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🔧 GearGuard Backend Started`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`🛢️  MongoDB: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gearguard'}\n`);
});
