# ✅ Technician Workflow Validation Checklist

This checklist validates that **ONLY technicians** can perform the core workflow:
1. ✅ View maintenance requests assigned to their team
2. ✅ Pick a request (assign to themselves)
3. ✅ Move it through stages: New → In Progress → Repaired
4. ✅ Record repair duration before closing

---

## 🔐 Backend Security Validation

### 1. API Endpoint Protection

#### GET /maintenance (List requests)
- ✅ **Requires**: `auth` middleware (Bearer token)
- ✅ **Technician sees**: Only requests for their team
- ✅ **Filter applied in controller**: `filter.team = user.team`
- ✅ **Admin/Manager sees**: All requests

**Test:**
```bash
# As technician - should see only team requests
curl -H "Authorization: Bearer <TECH_TOKEN>" http://localhost:3001/maintenance
# Response: Array of requests where team matches technician's team
```

#### POST /maintenance/:id/pick (Assign to yourself)
- ✅ **Requires**: `auth` + `authorize(['technician'])`
- ✅ **Enforced in controller**: Team membership check
  ```javascript
  if (user.role !== 'technician' || String(user.team) !== String(mr.team?._id)) {
    return 403 'Not authorized'
  }
  ```
- ✅ **Sets**: `assignedTo = user.id`, `status = 'in_progress'`

**Test:**
```bash
# As technician - should succeed if request is for their team
curl -X POST -H "Authorization: Bearer <TECH_TOKEN>" \
  http://localhost:3001/maintenance/<REQUEST_ID>/pick

# As user/other technician - should fail with 403
```

#### PUT /maintenance/:id (Update status/duration)
- ✅ **Requires**: `auth` + `authorize(['technician','manager','admin'])`
- ✅ **Technician restrictions enforced in controller**:
  - Can only update team requests: `String(user.team) !== String(mr.team)` → 403
  - Strict status transitions: `new → in_progress → repaired` (no other paths)
  - Can only change status if assigned: `mr.assignedTo !== user.id` → 403
  - **Duration required on repaired**: `!mr.duration` → 400

**Allowed Technician Transitions:**
| From | To | Allowed |
|------|-----|---------|
| new | in_progress | ✅ (if assigned or pick first) |
| in_progress | repaired | ✅ (with duration) |
| new | repaired | ❌ (invalid) |
| repaired | new | ❌ (invalid) |

**Test:**
```bash
# Mark as in_progress
curl -X PUT -H "Authorization: Bearer <TECH_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}' \
  http://localhost:3001/maintenance/<REQUEST_ID>

# Mark as repaired WITH duration
curl -X PUT -H "Authorization: Bearer <TECH_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"repaired","duration":2.5}' \
  http://localhost:3001/maintenance/<REQUEST_ID>

# Mark as repaired WITHOUT duration (should fail)
curl -X PUT -H "Authorization: Bearer <TECH_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"repaired"}' \
  http://localhost:3001/maintenance/<REQUEST_ID>
# Response: 400 'Duration is required when marking as repaired'
```

---

## 🎨 Frontend Route Protection

### Routes Accessible to Technician

| Route | Component | Protection | Visible |
|-------|-----------|-----------|---------|
| `/kanban` | KanbanBoard | `allowedRoles={["technician","admin"]}` | ✅ My Tasks |
| `/requests` | RequestsPage | `allowedRoles={["admin","manager","technician"]}` | ✅ Requests |
| `/request/:id` | RequestDetail | `ProtectedRoute` (all auth users) | ✅ (filtered by team) |

### Routes NOT Accessible to Technician

| Route | Purpose | Blocked |
|-------|---------|---------|
| `/requests/new` | Create request | ✅ (only user/manager/admin) |
| `/equipment` | Manage equipment | ✅ (only admin/manager) |
| `/calendar` | Calendar view | ✅ (only manager/admin) |
| `/manager-*` | Manager features | ✅ (only manager/admin) |
| `/my-requests` | User my requests | ✅ (only for user role) |

---

## 📊 Workflow State Machine (Technician Only)

```
┌─────────────────────────────────────────────────────────┐
│                   TECHNICIAN WORKFLOW                    │
└─────────────────────────────────────────────────────────┘

                        [NEW]
                     (Unassigned)
                          │
                  ┌───────┴────────┐
                  │                │
            [Pick Request]    [Drag/Transition]
                  │                │
                  └───────┬────────┘
                          ▼
                   [IN PROGRESS]
                    (Assigned to me)
                          │
                  [Drag to Repaired]
                  [OR Click Button]
                          │
                          ▼
                   [REPAIRED]
                (Required: duration)
                          │
                   (COMPLETE ✓)

RULES:
✅ Can pick unassigned requests for my team
✅ Can only transition through: new → in_progress → repaired
✅ Can only mark in_progress/repaired if assigned to me
✅ Must record duration when marking repaired
❌ Cannot skip steps (no new → repaired)
❌ Cannot go backwards (no repaired → in_progress)
❌ Cannot act on other team's requests
```

---

## 🧪 Manual Test Procedure

### Prerequisites
```bash
# Terminal 1: Seed DB and start backend
cd backend
npm run seed
npm run dev
# Expected: "Server running on port 3001"
#          "Connecting to MongoDB at mongodb://..."
```

### Test Steps

**Step 1: Login as Technician**
```
- URL: http://localhost:3000/login
- Email: tech@test.com
- Password: password123
- Expected: Redirected to dashboard with "Technician" role badge
```

**Step 2: View Team Requests (Dashboard)**
```
- Verify dashboard shows:
  ✅ Team info: "👥 Team: Alpha Team" (or assigned team)
  ✅ Recent Requests list
  ✅ Stats: Total Requests, In Progress, Overdue
```

**Step 3: Navigate to My Tasks (Kanban)**
```
- Click "⚙️ My Tasks" in sidebar
- Expected: Kanban board with 3 columns:
  ✅ 📋 New - Unassigned requests
  ✅ ⚙️ In Progress - Your active requests
  ✅ ✅ Repaired - Completed requests
```

**Step 4: Pick a Request**
```
Option A - Click Pick Button:
- Find a request in New column
- Click "👤 Pick" button
- Expected: Request moves to In Progress, assigned to you

Option B - Drag to In Progress:
- Drag a New request to In Progress column
- Expected: Pick endpoint called, request assigned to you
```

**Step 5: Mark In Progress to Repaired**
```
- Find your request in In Progress column
- Drag to Repaired column
- Expected: Duration Modal appears
  - Title: "Enter duration in hours (e.g. 2.5)"
  - Input field with autofocus
  - Cancel and Save buttons
- Enter duration: 2.5
- Click Save
- Expected: Request moves to Repaired, status updated
```

**Step 6: Verify in Request Detail**
```
- Click on a request in Requests list
- For In Progress request:
  ✅ "Mark Repaired (Enter Duration)" button visible
  ✅ Only appears if assigned to you
- For Repaired request:
  ✅ Status shows "REPAIRED"
  ✅ Duration displayed in details
  ✅ No action buttons (completed)
```

**Step 7: Verify Permissions**
```
- Try to navigate to /equipment
  Expected: Redirected to Dashboard (not authorized)
- Try to navigate to /calendar
  Expected: Redirected to Dashboard (not authorized)
- Try to navigate to /my-requests
  Expected: Redirected to Dashboard (not your role)
```

---

## 🔍 Verification Checklist

### Backend API Responses

**List Requests (GET /maintenance)**
```json
✅ Returns only team requests
✅ Populated fields: equipment, team, assignedTo, createdBy
✅ Response status: 200
```

**Pick Request (POST /maintenance/:id/pick)**
```json
✅ Returns updated request with:
  - status: "in_progress"
  - assignedTo: technician's ID
✅ Response status: 200
❌ Non-team request → 403
❌ Non-technician → 403
```

**Update Status (PUT /maintenance/:id)**
```json
✅ new → in_progress succeeds
✅ in_progress → repaired with duration succeeds
❌ new → repaired fails (invalid transition)
❌ Missing duration on repaired → 400
❌ Other team's request → 403
❌ Non-assigned technician → 403
```

### Frontend Behavior

- ✅ Kanban loads with filtered requests
- ✅ Drag between columns triggers API calls
- ✅ Duration modal appears when moving to Repaired
- ✅ RequestDetail shows appropriate action buttons
- ✅ Technician nav items appear only for technician role
- ✅ Logout clears token and user from localStorage
- ✅ Login redirects to dashboard with correct role

---

## 🚨 Known Restrictions (By Design)

### What Technician CANNOT Do
- ❌ Create new maintenance requests (user/manager role)
- ❌ View equipment list (admin/manager only)
- ❌ See requests from other teams
- ❌ Update requests not assigned to them
- ❌ Skip workflow stages
- ❌ Move request backwards in workflow
- ❌ Mark repaired without recording duration
- ❌ Access calendar or manager features
- ❌ Create preventive maintenance

### What Technician CAN Do
- ✅ View all requests for their team
- ✅ Pick (assign) any unassigned request from their team
- ✅ Update status: new → in_progress → repaired
- ✅ Record repair duration (required for completion)
- ✅ View full request details
- ✅ Filter requests by status, priority, type, search
- ✅ See team info on dashboard
- ✅ Logout and re-login

---

## 📋 Success Criteria

**Security:**
- ✅ Technician cannot access admin/manager routes
- ✅ Technician cannot view other team's requests
- ✅ Technician cannot update requests not assigned to them
- ✅ Backend rejects invalid transitions (strict state machine)
- ✅ Backend requires duration before marking repaired

**Functionality:**
- ✅ Pick button assigns request and moves to In Progress
- ✅ Drag-and-drop works between columns
- ✅ Duration modal appears and accepts decimal input
- ✅ Status updates correctly: new → in_progress → repaired
- ✅ RequestDetail shows appropriate action buttons
- ✅ Requests are filtered by technician's team

**UX:**
- ✅ Dashboard shows team info
- ✅ Nav shows "My Tasks" (Kanban) and "Requests"
- ✅ Kanban displays 3 columns with card counts
- ✅ Duration modal is user-friendly (focused input, clear labels)
- ✅ Error messages are helpful if something fails

---

**Test Date**: December 27, 2025  
**Test Environment**: localhost:3000 (frontend), localhost:3001 (backend)  
**Test Credentials**: tech@test.com / password123
