# GearGuard – Production-Ready Maintenance Management System

Complete MERN stack + Vanilla JS frontend for enterprise maintenance tracking.

## 📁 Project Structure

```
d:\odoo_hackathaon\
├── backend/                 # Node.js + Express API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # JWT auth
│   ├── seed.js             # Database seeding
│   ├── server.js           # Express app
│   ├── package.json
│   ├── .env                # Config file
│   └── README.md
│
├── frontend/               # React + Vanilla JS
│   ├── src/                # React app (npm start)
│   ├── vanilla/            # Standalone HTML/CSS/JS
│   │   ├── index.html      # Full dashboard UI
│   │   ├── css/style.css   # Modern SaaS styling
│   │   └── js/main.js      # Interactive features
│   └── public/
│
├── SETUP.bat               # Quick start guide
└── README.md
```

## ⚡ Quick Start

### Backend (API Server)

```bash
cd backend
npm install
npm run seed              # Optional: populate with test data
npm run dev              # Start with auto-reload
```

**Runs on:** `http://localhost:5000`

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

**Runs on:** `http://localhost:3000`

### Frontend (Vanilla HTML/CSS/JS)

Open in browser: `frontend/vanilla/index.html`

## 🔐 Login Credentials

- **Admin**: `admin@gearguard.com` / `password123`
- **Technician**: `mike@gearguard.com` / `password123`

## ✨ Features

✅ Equipment management  
✅ Maintenance request workflow  
✅ Kanban board with drag & drop  
✅ Interactive calendar  
✅ Team management  
✅ Role-based access control  
✅ JWT authentication  
✅ Responsive design  
✅ Production-ready API  

See [backend/README.md](backend/README.md) for full documentation.
