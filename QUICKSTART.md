# GearGuard - Quick Start Guide

## 📋 Prerequisites

- **Node.js** v14+ (with npm)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (optional, for version control)

---

## 🚀 Installation & Setup

### Step 1: Clone/Extract Project

```bash
cd d:\odoo_hackathaon
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected packages to install:**
- express (server framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment variables)
- cors (cross-origin requests)

### Step 3: Setup Environment Variables

Create `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gearguard?retryWrites=true&w=majority
```

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Expected packages to install:**
- react (UI library)
- react-router-dom (routing)
- axios (HTTP client)
- react-beautiful-dnd (drag-drop)

### Step 5: Setup Frontend API URL (Optional)

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

### Terminal 2: Seed Initial Data (Optional)

```bash
cd backend
npm run seed
```

**Creates:**
- 2 teams (Engineering, Operations)
- 5 users (admin, manager, 3 technicians)
- 10 equipment items
- 15 maintenance requests

### Terminal 3: Start Frontend Dev Server

```bash
cd frontend
npm start
```

**Expected:**
- Browser opens to http://localhost:3000
- Login screen appears

---

## 🔐 Default Login Credentials

After seeding, use these to login:

```
Email: admin@gearguard.com
Password: admin123

OR

Email: tech1@gearguard.com
Password: password123
```

---

## 📱 Testing the Application

### ✅ Dashboard Page
1. Login with any account
2. See equipment statistics
3. View recent maintenance requests
4. Click "Refresh" button → data updates

### ✅ Equipment Page
1. Click "Equipment" in sidebar
2. See list of all equipment
3. Click "Add Equipment" → opens form
4. Fill name, code, location, team, description
5. Click "Add" → equipment appears in list
6. Click "Edit" → modify equipment
7. Click "Delete" → equipment removed

### ✅ Requests Page
1. Click "Requests" in sidebar
2. See all maintenance requests
3. Use filters: Status, Priority, Type, Search
4. Click status dropdown → change request status
5. Click "Delete" → remove request
6. See overdue indicators (red background)

### ✅ Create Request Page
1. Click "New Request" button
2. Select equipment from dropdown
3. Choose type: Preventive or Corrective
4. Choose priority: Low, Medium, High
5. Set scheduled date with date picker
6. Fill description
7. Click "Submit" → request created

### ✅ Kanban Board
1. Click "Kanban" in sidebar
2. See requests organized by status columns
3. Drag request card to different column → status updates
4. Click "Pick" button on request → assigns to current user
5. See request moves to "In Progress" column
6. See assignee avatar on card

### ✅ Calendar View
1. Click "Calendar" in sidebar
2. Navigate months using ← Today → buttons
3. Click on day with events → see maintenance requests
4. View "Upcoming Events" list in sidebar

---

## 🔧 Troubleshooting

### Backend won't start

**Problem:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

### MongoDB connection error

**Problem:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
1. Ensure MongoDB is running:
   - **Windows:** `mongod` in another terminal
   - **Atlas:** Check connection string in `.env`
2. Verify `MONGODB_URI` in `.env` is correct

### Frontend shows blank page

**Problem:** `CORS error` in browser console

**Solution:**
1. Ensure backend is running on port 5000
2. Check `package.json` proxy setting (should be `http://localhost:5000`)
3. Restart frontend: `npm start`

### Authentication issues

**Problem:** `401 Unauthorized` errors

**Solution:**
1. Clear browser localStorage:
   - Press F12 → Application tab → Storage → localStorage
   - Delete token entry
   - Refresh page
   - Login again
2. Verify user exists in database:
   - Run seed: `npm run seed`

### Port already in use

**Problem:** `Error: listen EADDRINUSE :::5000`

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

---

## 📂 Project Structure Reference

```
gearguard/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── server.js
│   └── seed.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── docs/
    ├── FEATURES_AND_BUTTONS.md
    ├── QUICK_TEST_GUIDE.md
    ├── API_REFERENCE.md
    ├── SYSTEM_ARCHITECTURE.md
    └── PROJECT_COMPLETION_SUMMARY.md
```

---

## 🌐 API Quick Reference

```
Base URL: http://localhost:5000/api

Login
  POST /auth/login
  Body: { email, password }

Equipment
  GET /equipment
  POST /equipment
  PUT /equipment/:id
  DELETE /equipment/:id

Requests
  GET /maintenance
  POST /maintenance
  PUT /maintenance/:id
  DELETE /maintenance/:id
  POST /maintenance/:id/pick

Teams
  GET /teams

Users
  GET /users
```

---

## 📝 Common Tasks

### View backend logs
```bash
cd backend
npm start
```
(Logs appear in terminal)

### Reset database
```bash
cd backend
npm run seed
```
(Recreates all data)

### View database with GUI
1. Install MongoDB Compass (free)
2. Connect to `mongodb://localhost:27017`
3. Browse `gearguard` database
4. View collections: Equipment, MaintenanceRequest, User, Team

### Deploy to production
1. See [PROJECT_COMPLETION_SUMMARY.md](PROJECT_COMPLETION_SUMMARY.md)
2. Follow "Production Deployment" section
3. Use environment-specific `.env` files

---

## 🎯 Next Steps

1. **Explore the features:** Follow testing guide in [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md)
2. **Understand the code:** Check [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
3. **API development:** See [API_REFERENCE.md](API_REFERENCE.md)
4. **Feature completeness:** Review [FEATURES_AND_BUTTONS.md](FEATURES_AND_BUTTONS.md)

---

## 💡 Tips

- **Clear cache:** Press `Ctrl+Shift+Delete` to clear all browser data when troubleshooting
- **View network requests:** Press F12 → Network tab → perform action → see API calls
- **Check user permissions:** Different roles (admin, manager, technician) have different access
- **Test with curl:** Use provided curl examples in [API_REFERENCE.md](API_REFERENCE.md)

---

## 📞 Support

If something isn't working:

1. **Check logs:** Look at terminal output (backend) and console (F12 frontend)
2. **Read error message:** Most errors are descriptive
3. **Search docs:** Look in the markdown files
4. **Verify setup:** Re-run installation steps
5. **Reset data:** Run `npm run seed` in backend

---

## ✅ Verification Checklist

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] MongoDB is running or Atlas account is ready
- [ ] Backend dependencies installed (`npm install` in backend)
- [ ] Frontend dependencies installed (`npm install` in frontend)
- [ ] `.env` file created in backend with correct MongoDB URI
- [ ] Backend server starts without errors
- [ ] Frontend loads without errors
- [ ] Can login with default credentials
- [ ] Dashboard shows equipment count and requests
- [ ] Can create, edit, and delete equipment
- [ ] Can create and manage requests
- [ ] Kanban board shows requests in columns
- [ ] Calendar view shows scheduled requests

Once all items are checked, your GearGuard installation is ready! 🎉
