# Role-Based Dashboard System - Complete Implementation

## Overview
GearGuard now features 3 distinct role-based dashboards:

### 1. **USER Role** (Normal Employees)
Employees can raise maintenance requests and track their status.

**Pages:**
- **My Requests** (`/my-requests`) - View all requests created by the user
  - Search and filter by status
  - Quick overview of request details
  - Click to view full request details

- **Create Request** (`/user-create-request`) - Submit new maintenance request
  - Fill: Subject, Equipment, Type (Corrective/Preventive), Priority, Description
  - Auto-filled: Equipment Category, Assigned Team (from equipment)
  - Creates request with status "new"

- **Request Detail** (`/request/:id`) - View request status (read-only for users)
  - Shows full request information
  - Displays current status and team assigned
  - Real-time updates of work progress

---

### 2. **TECHNICIAN Role** (Maintenance Team Members)
Technicians work on maintenance requests assigned to their team.

**Pages:**
- **My Tasks / Kanban Board** (`/kanban`) - Visual workflow board
  - 4 columns: New → In Progress → Repaired → Scrapped
  - Drag-and-drop status updates
  - Shows: Subject, Equipment, Type, Assigned Tech
  - Color-coded priority indicators

- **Request Detail with Actions** (`/request/:id`) - Full task management
  - **Pick Request** - Assign task to yourself (only for unassigned "new" requests)
  - **Mark In Progress** - Start working on the task
  - **Mark Repaired** - Complete task (requires duration/hours spent)
  - Duration tracking for maintenance records

---

### 3. **MANAGER Role** (Preventive Maintenance Scheduling)
Managers schedule and view preventive maintenance calendar.

**Pages:**
- **Schedule Preventive Maintenance** (`/manager-create-preventive`) - Create scheduled tasks
  - Fill: Subject, Equipment, Scheduled Date, Description
  - Type auto-set to "Preventive"
  - Auto-filled: Assigned Team (from equipment)
  - Schedule for future dates

- **Maintenance Calendar** (`/manager-calendar`) - Visual calendar view
  - Monthly/weekly calendar layout
  - Shows scheduled preventive tasks on their dates
  - Lists upcoming scheduled maintenance
  - Click to view request details

---

## Backend Changes

### Authentication & User Model
- User.role can be: `'admin'`, `'user'`, `'technician'`, `'manager'`
- JWT token includes role for client-side role detection

### Maintenance Controller - Role-Based Filtering
```javascript
// Users see only their own requests
filter.createdBy = user.id

// Technicians see only their team's requests
filter.team = user.team

// Managers & Admins see all requests
// (no filter)
```

### Registration Endpoint
- Now supports optional `role` parameter
- Defaults to `'user'` (normal employee)
- Can specify: `'user'`, `'technician'`, `'manager'`, `'admin'`

---

## Frontend Implementation

### AuthContext
- Decodes JWT token to extract user `id` and `role`
- Available globally via `useAuth()` hook
- Persists across page navigation

### Layout Navigation
**Dynamic sidebar based on role:**
- **USER**: My Requests, Create Request
- **TECHNICIAN**: My Tasks (Kanban), Requests
- **MANAGER**: Calendar, Schedule Maintenance
- **ADMIN**: Full dashboard with all options

### Route Protection
All role-specific routes are protected with ProtectedRoute component

---

## Test Credentials

After running `npm run seed`, use these test accounts:

### Employees (Normal Users)
- **Email:** john@gearguard.com
- **Email:** jane@gearguard.com
- **Password:** password123

### Technicians (Maintenance Team)
- **Email:** mike@gearguard.com (Team Alpha)
- **Email:** sarah@gearguard.com (Team Beta)
- **Email:** james@gearguard.com (Team Gamma)
- **Password:** password123

### Manager
- **Email:** manager@gearguard.com
- **Password:** password123

### Admin
- **Email:** admin@gearguard.com
- **Password:** password123

---

## Feature Specifications

### USER Workflow
1. Login → Dashboard (My Requests)
2. Click "+ New Request" → Create Request form
3. Fill form → Submit
4. View request in "My Requests" with status badge
5. Click request to see details
6. Wait for technician to pick up and work on it
7. Status updates visible in real-time

### TECHNICIAN Workflow
1. Login → Kanban Board (My Tasks)
2. See "New" requests assigned to their team
3. Click request → "Pick Request" to assign to self
4. Drag card to "In Progress" or click action
5. Work on task → "Mark Repaired" (must enter hours spent)
6. Task moves to "Repaired" column
7. Can also mark equipment as "Scrapped" if beyond repair

### MANAGER Workflow
1. Login → Maintenance Calendar
2. Click "+ Schedule Maintenance"
3. Select equipment & scheduled date
4. Submit → Auto-appears on calendar
5. View calendar by month
6. Click scheduled task to view details
7. Can see upcoming preventive maintenance timeline

---

## File Structure

### New Pages Created
```
frontend/src/pages/
├── UserCreateRequest.jsx      # User: Create request form
├── UserMyRequests.jsx         # User: View their requests
├── RequestDetail.jsx          # Shared: Request detail with role-based actions
├── ManagerCreatePreventive.jsx # Manager: Schedule preventive maintenance
└── ManagerCalendar.jsx        # Manager: Calendar view of scheduled tasks
```

### New Context
```
frontend/src/context/
└── AuthContext.jsx            # Provides user role globally
```

### Updated Files
```
frontend/src/
├── App.js                     # Added AuthProvider & new routes
├── components/Layout.jsx      # Role-based navigation sidebar
├── services/authService.js    # Already had login/logout
└── services/api.js            # Already had token interceptor

backend/
├── controllers/authController.js  # Updated register to accept role
├── controllers/maintenanceController.js # Added role-based filtering
├── seed.js                    # Added more test users with different roles
└── routes/index.js            # No changes needed
```

---

## Quick Start

### 1. Seed Database with Test Data
```bash
cd backend
npm run seed
```

### 2. Start Backend
```bash
npm run dev  # or npm start
```

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm start
```

### 4. Test Each Role
- **Employee:** Login with john@gearguard.com, create a request
- **Technician:** Login with mike@gearguard.com, pick the request
- **Manager:** Login with manager@gearguard.com, schedule preventive task

---

## Notes

- All role-specific pages have appropriate action buttons based on user role
- Technicians can only see/work on requests for their team
- Users can only see requests they created
- Managers see all requests but can only create preventive ones
- Request detail page is shared and shows different actions based on user role
- Calendar shows only preventive requests (type='preventive')
- Duration entry for technicians creates maintenance time records

---

**Status:** ✅ Complete and ready for testing!
