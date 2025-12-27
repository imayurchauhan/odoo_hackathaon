# GearGuard Backend - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "mike@gearguard.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f...",
    "name": "Mike",
    "email": "mike@gearguard.com",
    "role": "technician",
    "team": "507f..."
  }
}
```

---

## Equipment Endpoints

### List All Equipment
```
GET /equipment
Auth: ✅ Required

Response: 200 OK
[
  {
    "_id": "507f...",
    "name": "Pump Motor A",
    "code": "PM-001",
    "location": "Building A",
    "description": "Main circulation pump",
    "team": {
      "_id": "507f...",
      "name": "Mechanical"
    },
    "isScrapped": false,
    "lastMaintenanceAt": "2024-12-20T10:30:00Z",
    "createdAt": "2024-12-15T09:00:00Z"
  }
]
```

### Get Single Equipment
```
GET /equipment/:id
Auth: ✅ Required

Response: 200 OK
{
  "_id": "507f...",
  "name": "Pump Motor A",
  "code": "PM-001",
  ...
}

Response: 404 Not Found
{
  "message": "Equipment not found"
}
```

### Create Equipment
```
POST /equipment
Auth: ✅ Required
Content-Type: application/json

{
  "name": "Pump Motor A",
  "code": "PM-001",
  "location": "Building A",
  "description": "Main circulation pump",
  "team": "507f..."  // optional
}

Response: 201 Created
{
  "_id": "507f...",
  "name": "Pump Motor A",
  "code": "PM-001",
  ...
}
```

### Update Equipment
```
PUT /equipment/:id
Auth: ✅ Required
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "New Location"
}

Response: 200 OK
{
  "_id": "507f...",
  "name": "Updated Name",
  ...
}

Response: 404 Not Found
{
  "message": "Equipment not found"
}
```

### Delete Equipment
```
DELETE /equipment/:id
Auth: ✅ Required

Response: 200 OK
{
  "message": "Deleted"
}

Response: 404 Not Found
{
  "message": "Equipment not found"
}
```

---

## Maintenance Request Endpoints

### List All Requests
```
GET /maintenance?status=new&type=preventive&team=507f...
Auth: ✅ Required

Query Parameters (all optional):
- status: "new" | "in_progress" | "repaired" | "scrap"
- type: "preventive" | "corrective"
- team: Team ObjectId
- priority: "low" | "medium" | "high"

Response: 200 OK
[
  {
    "_id": "507f...",
    "title": "Routine quarterly inspection",
    "equipment": {
      "_id": "507f...",
      "name": "Pump Motor A",
      "code": "PM-001"
    },
    "type": "preventive",
    "priority": "medium",
    "status": "new",
    "description": "Standard maintenance check",
    "scheduledAt": "2024-12-28T00:00:00Z",
    "dueAt": "2024-12-28T00:00:00Z",
    "completedAt": null,
    "team": {
      "_id": "507f...",
      "name": "Mechanical"
    },
    "assignedTo": null,
    "createdBy": {
      "_id": "507f...",
      "name": "Admin User"
    },
    "createdAt": "2024-12-27T10:00:00Z"
  }
]
```

### Get Single Request
```
GET /maintenance/:id
Auth: ✅ Required

Response: 200 OK
{
  "_id": "507f...",
  "title": "Routine quarterly inspection",
  ...
}

Response: 404 Not Found
{
  "message": "Request not found"
}
```

### Create Request
```
POST /maintenance
Auth: ✅ Required
Content-Type: application/json

{
  "title": "Routine inspection",
  "equipment": "507f...",  // ObjectId, required
  "type": "preventive",    // default: "preventive"
  "priority": "medium",    // default: "medium"
  "description": "Check for wear",
  "scheduledAt": "2024-12-28T00:00:00Z"  // optional
}

Response: 201 Created
{
  "_id": "507f...",
  "title": "Routine inspection",
  "status": "new",
  "team": "507f...",  // auto-filled from equipment
  "createdBy": "507f...",  // auto-filled from logged-in user
  ...
}

Response: 400 Bad Request
{
  "message": "Invalid equipment"
}
```

### Update Request Status/Details
```
PUT /maintenance/:id
Auth: ✅ Required
Content-Type: application/json

{
  "status": "in_progress",
  "description": "Updated notes",
  "priority": "high"
}

Response: 200 OK
{
  "_id": "507f...",
  "status": "in_progress",
  ...
}

Special Behaviors:
- If status = "repaired":
  - Sets completedAt to current date
  - Updates equipment.lastMaintenanceAt
  
- If status = "scrap":
  - Sets equipment.isScrapped = true
  
- If status = "in_progress":
  - Can be set by drag-drop or pick endpoint

Response: 404 Not Found
{
  "message": "Request not found"
}
```

### Delete Request
```
DELETE /maintenance/:id
Auth: ✅ Required

Response: 200 OK
{
  "message": "Deleted"
}

Response: 404 Not Found
{
  "message": "Request not found"
}
```

### Pick Request (Assign to Self)
```
POST /maintenance/:id/pick
Auth: ✅ Required

Response: 200 OK
{
  "_id": "507f...",
  "status": "in_progress",
  "assignedTo": "507f...",  // current user's ID
  ...
}

Response: 403 Forbidden
{
  "message": "Not authorized to pick this request"
}
Note: User must be a technician and belong to request's team

Response: 404 Not Found
{
  "message": "Request not found"
}

Response: 401 Unauthorized
{
  "message": "Auth required"
}
```

---

## Teams Endpoints

### List All Teams
```
GET /teams
Auth: ✅ Required

Response: 200 OK
[
  {
    "_id": "507f...",
    "name": "Mechanical",
    "description": "Mechanical maintenance team"
  }
]
```

### Get Single Team
```
GET /teams/:id
Auth: ✅ Required

Response: 200 OK
{
  "_id": "507f...",
  "name": "Mechanical",
  "description": "Mechanical maintenance team"
}
```

---

## Users Endpoints

### List All Users
```
GET /users
Auth: ✅ Required

Response: 200 OK
[
  {
    "_id": "507f...",
    "name": "Mike Johnson",
    "email": "mike@gearguard.com",
    "role": "technician",
    "team": "507f..."
  }
]
```

### Get Single User
```
GET /users/:id
Auth: ✅ Required

Response: 200 OK
{
  "_id": "507f...",
  "name": "Mike Johnson",
  "email": "mike@gearguard.com",
  "role": "technician",
  "team": {
    "_id": "507f...",
    "name": "Mechanical"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid equipment"
}
```

### 401 Unauthorized
```json
{
  "message": "Auth required"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to pick this request"
}
```

### 404 Not Found
```json
{
  "message": "Equipment not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Database Schema

### Equipment
```javascript
{
  _id: ObjectId,
  name: String (required),
  code: String (required),
  location: String,
  description: String,
  team: ObjectId (ref: Team),
  isScrapped: Boolean (default: false),
  lastMaintenanceAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### MaintenanceRequest
```javascript
{
  _id: ObjectId,
  title: String (required),
  equipment: ObjectId (ref: Equipment, required),
  type: String (enum: ['preventive', 'corrective']),
  priority: String (enum: ['low', 'medium', 'high']),
  status: String (enum: ['new', 'in_progress', 'repaired', 'scrap']),
  description: String,
  scheduledAt: Date,
  dueAt: Date,
  completedAt: Date,
  team: ObjectId (ref: Team),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: String (enum: ['admin', 'manager', 'technician']),
  team: ObjectId (ref: Team),
  createdAt: Date,
  updatedAt: Date
}
```

### Team
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Seed Data

Run `npm run seed` to populate database with sample data:

**Teams** (3):
- Mechanical
- Electrical
- HVAC

**Users** (4):
- admin@gearguard.com (admin)
- mike@gearguard.com (technician, Mechanical)
- sarah@gearguard.com (technician, Electrical)
- james@gearguard.com (manager, HVAC)

All passwords: `password123`

**Equipment** (3):
- Pump Motor A (PM-001, Mechanical)
- Compressor Unit (CMP-002, Electrical)
- Chiller System (CHI-003, HVAC)

**Maintenance Requests** (3):
- Preventive maintenance on each equipment

---

## Development Commands

```bash
# Start server
npm start

# Start with nodemon (auto-reload)
npm run dev

# Seed database
npm run seed

# Run tests (when available)
npm test
```

---

## Environment Variables (.env)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/gearguard
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## Rate Limiting
Not implemented - add for production!

## Logging
Console logging enabled - implement proper logging service for production.

## Validation
Basic validation on controller level - consider adding schema validation middleware.
