#!/bin/bash
# GearGuard Backend Quick Fix Script
# Run this to diagnose and fix common issues

echo "🔧 GearGuard Backend Diagnostics"
echo "================================="
echo

# Check Node version
echo "✓ Node.js version:"
node --version

echo
echo "✓ NPM version:"
npm --version

echo
echo "Checking MongoDB..."
# Try to connect to MongoDB
timeout 2 mongo mongodb://127.0.0.1:27017/gearguard --eval "db.version()" 2>/dev/null && echo "✅ MongoDB is running" || echo "❌ MongoDB is not running or not accessible"

echo
echo "================================="
echo "Common Issues & Fixes:"
echo "================================="
echo
echo "1. MongoDB not running?"
echo "   Windows: mongod"
echo "   macOS:   brew services start mongodb-community"
echo "   Linux:   sudo systemctl start mongod"
echo
echo "2. Dependencies missing?"
echo "   Run: npm install"
echo
echo "3. Port 5000 in use?"
echo "   Change PORT in .env or kill process"
echo "   Windows: netstat -ano | findstr :5000"
echo
echo "4. Database empty?"
echo "   Run: npm run seed"
echo
echo "5. Need to clear database?"
echo "   MongoDB CLI: db.dropDatabase()"
echo
