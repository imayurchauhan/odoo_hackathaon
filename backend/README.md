# GearGuard Backend

Production-ready MERN maintenance management backend.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure MongoDB is running locally:
```bash
mongod
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

This creates:
- 3 sample teams (Alpha, Beta, Gamma)
- 4 users (1 admin + 3 technicians)
- 3 equipment units
- 3 maintenance requests

Sample credentials:
- **Admin**: `admin@gearguard.com` / `password123`
- **Technician**: `mike@gearguard.com` / `password123`

### 4. Start Server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` — Login and get JWT token

### Equipment
- `GET /api/equipment` — List all equipment
- `POST /api/equipment` — Create equipment
- `GET /api/equipment/:id` — Get equipment details
- `PUT /api/equipment/:id` — Update equipment
- `DELETE /api/equipment/:id` — Delete equipment

### Teams
- `GET /api/teams` — List all teams
- `POST /api/teams` — Create team
- `GET /api/teams/:id` — Get team details
- `PUT /api/teams/:id` — Update team
- `DELETE /api/teams/:id` — Delete team

### Users
- `GET /api/users` — List all users
- `POST /api/users` — Register user
- `GET /api/users/:id` — Get user details
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Maintenance Requests
- `GET /api/maintenance` — List requests (supports filters: `?type=preventive&team=ID&status=new`)
- `POST /api/maintenance` — Create request
- `GET /api/maintenance/:id` — Get request details
- `PUT /api/maintenance/:id` — Update request status/workflow
- `DELETE /api/maintenance/:id` — Delete request
- `POST /api/maintenance/:id/pick` — Technician picks up request

## Features

✅ JWT authentication with role-based access  
✅ Auto-fill team when equipment selected  
✅ Workflow: New → In Progress → Repaired → Scrap  
✅ Scrap logic: marks equipment.isScrapped = true  
✅ Preventive vs Corrective request types  
✅ Overdue request tracking  
✅ Technician team membership validation  
✅ MongoDB schema enforcement with Mongoose  

## Database

MongoDB Collections:
- `equipment` — Equipment inventory
- `teams` — Maintenance teams
- `users` — Technicians and admins
- `maintenance_requests` — Service requests

Connection: `mongodb://127.0.0.1:27017/gearguard`

## Testing

Login example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gearguard.com","password":"password123"}'
```

Response includes JWT token to use in subsequent requests:
```bash
curl -X GET http://localhost:5000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port already in use:**
- Change PORT in `.env` or kill existing process

**Missing dependencies:**
- Run `npm install` again
- Check Node version (v14+ required)

## Project Structure

```
backend/
  config/
    db.js              -- MongoDB connection
  models/
    Equipment.js       -- Equipment schema
    Team.js            -- Team schema
    User.js            -- User schema
    MaintenanceRequest.js  -- Request schema
  controllers/
    authController.js  -- Login logic
    equipmentController.js
    teamController.js
    userController.js
    maintenanceController.js  -- Workflow logic
  routes/
    index.js           -- Route entry point
    equipment.js
    teams.js
    users.js
    maintenance.js
  middleware/
    auth.js            -- JWT verification
  server.js            -- Express app
  seed.js              -- Database seeding
  package.json
  .env                 -- Configuration
```

## License

MIT
