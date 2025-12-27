# GearGuard - System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     GEARGUARD SYSTEM                            │
└─────────────────────────────────────────────────────────────────┘

                           FRONTEND
                      ┌──────────────┐
                      │  React 18.0  │
                      └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌────────┐      ┌────────────┐      ┌──────────┐
    │ Routes │      │ Components │      │ Services │
    └────────┘      └────────────┘      └──────────┘
        │                   │                   │
    ┌───────────────────────────────────────────┐
    │        React Router v6 Navigation         │
    │  / | /equipment | /requests | /kanban ... │
    └───────────────────────────────────────────┘
                           │
                           │ Axios HTTP Client
                           │ (JWT Token Auto-Inject)
                           │
                    ┌──────────────┐
                    │  API Gateway │
                    │ :5000 /api   │
                    └──────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────────────┐                ┌────────────────────┐
│  BACKEND                       │  DATABASE          │
│  Node.js/Express              │  MongoDB           │
└───────────────┘                └────────────────────┘
        │
        ├─ Routes Layer
        │  ├── /auth
        │  ├── /equipment
        │  ├── /maintenance
        │  ├── /teams
        │  └── /users
        │
        ├─ Middleware
        │  ├── CORS
        │  ├── JSON Parser
        │  ├── Error Handler
        │  └── Auth Middleware (JWT)
        │
        ├─ Controllers
        │  ├── authController
        │  ├── equipmentController
        │  ├── maintenanceController
        │  ├── userController
        │  └── teamController
        │
        ├─ Models (Mongoose)
        │  ├── Equipment
        │  ├── MaintenanceRequest
        │  ├── User
        │  └── Team
        │
        └─ Config
           └── MongoDB Connection
```

---

## Data Flow Diagram

```
USER INTERACTION (Frontend)
    ↓
┌──────────────────────────────┐
│  User Clicks Button/Form     │
│  (Create, Update, Delete)    │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  React State Management      │
│  (useState hooks)            │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Form Validation             │
│  (Client-side)               │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Axios HTTP Request          │
│  (Auto-adds JWT token)       │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Express Middleware          │
│  (Auth, CORS, JSON parse)    │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Route Handler               │
│  (/equipment, /maintenance)  │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Controller Logic            │
│  (CRUD operations)           │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Mongoose Model              │
│  (Schema validation)         │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  MongoDB Database            │
│  (Data persistence)          │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Response Data               │
│  (JSON)                      │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  Frontend State Update       │
│  (setItems, setStats)        │
└──────────────────────────────┘
    ↓
┌──────────────────────────────┐
│  UI Re-render                │
│  (React reconciliation)      │
└──────────────────────────────┘
```

---

## Feature Map

```
GEARGUARD APPLICATION STRUCTURE

Dashboard (/)
├─ Statistics Cards (4)
├─ Recent Requests List
└─ Refresh Button

Equipment (/equipment)
├─ Equipment Table
├─ Add Button → Form
├─ Edit Button (per row) → Form
├─ Delete Button (per row)
├─ Search/Filter
└─ Statistics Cards

Requests (/requests)
├─ Filter Panel (4 filters)
├─ Requests Table
├─ New Request Button
├─ Status Dropdown (per row)
├─ View Button (per row)
├─ Delete Button (per row)
└─ Results Info

New Request (/requests/new)
├─ Request Details Section
│  └─ Title Input
├─ Equipment Selection
│  ├─ Equipment Dropdown
│  └─ Equipment Preview Card
├─ Request Configuration
│  ├─ Type Radio Buttons
│  └─ Priority Radio Buttons
├─ Scheduled Date Picker
├─ Description Textarea
└─ Submit/Cancel Buttons

Kanban (/kanban)
├─ Column: New
│  └─ Draggable Cards (with Pick button)
├─ Column: In Progress
│  └─ Draggable Cards (with assignee)
├─ Column: Repaired
│  └─ Draggable Cards
├─ Column: Scrap
│  └─ Draggable Cards
├─ Statistics (Total, Active)
└─ Loading Indicator

Calendar (/calendar)
├─ Month Navigation
│  ├─ Previous Button
│  ├─ Today Button
│  └─ Next Button
├─ Calendar Grid (7 columns)
│  └─ Clickable Days with Events
└─ Upcoming Events Sidebar
```

---

## API Endpoint Map

```
BASE URL: http://localhost:5000/api

Authentication
├─ POST /auth/login
└─ Response: { token, user }

Equipment CRUD
├─ GET /equipment
├─ POST /equipment
├─ GET /equipment/:id
├─ PUT /equipment/:id
└─ DELETE /equipment/:id

Maintenance CRUD + Actions
├─ GET /maintenance?status=...&type=...&team=...
├─ POST /maintenance
├─ GET /maintenance/:id
├─ PUT /maintenance/:id (status update)
├─ DELETE /maintenance/:id
└─ POST /maintenance/:id/pick (self-assign)

Teams
├─ GET /teams
└─ GET /teams/:id

Users
├─ GET /users
└─ GET /users/:id
```

---

## Database Schema Map

```
Equipment Collection
├─ _id: ObjectId (Primary)
├─ name: String
├─ code: String
├─ location: String
├─ description: String
├─ team: ObjectId → Team
├─ isScrapped: Boolean
├─ lastMaintenanceAt: Date
├─ createdAt: Date
└─ updatedAt: Date

MaintenanceRequest Collection
├─ _id: ObjectId (Primary)
├─ title: String
├─ equipment: ObjectId → Equipment
├─ type: String (preventive|corrective)
├─ priority: String (low|medium|high)
├─ status: String (new|in_progress|repaired|scrap)
├─ description: String
├─ scheduledAt: Date
├─ dueAt: Date
├─ completedAt: Date
├─ team: ObjectId → Team
├─ assignedTo: ObjectId → User
├─ createdBy: ObjectId → User
├─ createdAt: Date
└─ updatedAt: Date

User Collection
├─ _id: ObjectId (Primary)
├─ name: String
├─ email: String (Unique)
├─ password: String (Hashed)
├─ role: String (admin|manager|technician)
├─ team: ObjectId → Team
├─ createdAt: Date
└─ updatedAt: Date

Team Collection
├─ _id: ObjectId (Primary)
├─ name: String
├─ description: String
├─ createdAt: Date
└─ updatedAt: Date
```

---

## Component Hierarchy

```
App
└── Layout
    ├── Sidebar Navigation
    │  └── NavItems (5 routes)
    ├── Header
    │  ├── Search Bar
    │  ├── User Profile
    │  └── Logout Button
    └── Routes
        ├── Dashboard
        │  ├── StatCard (×4)
        │  └── RecentRequestsList
        ├── EquipmentPage
        │  ├── EquipmentForm
        │  │  └── FormInputs
        │  ├── EquipmentTable
        │  │  └── EquipmentRow (×many)
        │  └── StatCards (×3)
        ├── RequestsPage
        │  ├── FiltersSection
        │  │  ├── SearchInput
        │  │  └── SelectFilters (×3)
        │  ├── RequestsTable
        │  │  └── RequestRow (×many)
        │  └── ResultsInfo
        ├── MaintenanceForm
        │  ├── FormSections
        │  │  ├── RequestDetails
        │  │  ├── EquipmentSelection
        │  │  │  └── EquipmentPreview
        │  │  └── RequestConfiguration
        │  └── FormActions
        ├── KanbanBoard
        │  ├── StatCards (×2)
        │  └── KanbanColumns (×4)
        │     └── KanbanCard (×many)
        │        └── Avatar
        └── CalendarView
           ├── MonthNavigation
           ├── CalendarGrid
           │  └── DayCell (×35)
           └── UpcomingEvents
```

---

## State Management Flow

```
Dashboard Component
├── State: stats
│  ├── equipment: number
│  ├── requests: number
│  ├── inProgress: number
│  └── overdue: number
├── State: requests (array)
└── Effect: Load on mount
   └── Fetch /equipment + /maintenance

EquipmentPage Component
├── State: items (array)
├── State: form (object)
├── State: showForm (boolean)
├── State: editingId (string|null)
└── Effect: Load equipment on mount

RequestsPage Component
├── State: requests (array)
├── State: filteredRequests (array)
├── State: filters (object)
└── Effect: Apply filters whenever dependency changes

MaintenanceForm Component
├── State: form (object)
├── State: equipment (array)
├── State: selected (object|null)
├── State: loading (boolean)
├── State: error (string)
└── Effect: Load equipment + parse URL params on mount

KanbanBoard Component
├── State: items (array)
├── State: loading (boolean)
└── Effect: Load maintenance requests on mount

CalendarView Component
├── State: currentDate
├── Computed: monthDays (derived from currentDate)
└── Effect: None (derived state)
```

---

## Authentication Flow

```
User Login (POST /auth/login)
    ↓
┌──────────────────────┐
│ email + password     │
└──────────────────────┘
    ↓
Backend Verification
├─ Find user by email
├─ Hash password with bcrypt
└─ Compare with stored hash
    ↓
┌──────────────────────┐
│ JWT Token Generated  │
│ Valid for 7 days     │
└──────────────────────┘
    ↓
Frontend Storage
└─ localStorage.setItem('token', jwtToken)
    ↓
Auto-inject to Requests
└─ Axios interceptor adds:
   Authorization: Bearer {jwtToken}
    ↓
Backend Auth Middleware
├─ Extract token from header
├─ Verify signature
└─ Attach user to req.user
    ↓
Protected Route Access ✓
```

---

## Error Handling Strategy

```
Client-Side Validation
├─ Form field validation
├─ Required field checks
└─ Show user-friendly messages

API Request Errors
├─ Network errors
├─ Timeout handling
└─ Display error alerts

Server-Side Validation
├─ Mongoose schema validation
├─ Business logic validation
└─ Return HTTP error codes

Error Response Format
├─ 400: Bad Request (validation)
├─ 401: Unauthorized (auth)
├─ 403: Forbidden (permission)
├─ 404: Not Found
└─ 500: Server Error

Error Handling Middleware
└─ Express error handler
   └─ Log error
   └─ Send appropriate status + message
```

---

## Request Lifecycle Example: Create Equipment

```
1. User fills equipment form
   └─ name, code, location, team, description

2. User clicks "Add Equipment"
   └─ onClick handler triggered

3. Form validation
   └─ Check name and code are filled
   └─ If invalid → show error alert → return

4. API call
   └─ POST /api/equipment
   └─ Headers: Authorization: Bearer {token}
   └─ Body: { name, code, location, team, description }

5. Backend receives request
   └─ Auth middleware verifies JWT
   └─ Route handler routes to equipmentController.create
   └─ Controller validates body
   └─ Mongoose validates schema
   └─ MongoDB inserts document

6. Backend response
   └─ 201 Created
   └─ Body: { _id, name, code, ..., team: {...} }

7. Frontend receives response
   └─ setForm to empty object (reset form)
   └─ Call load() to refresh equipment list
   └─ Component re-renders with new equipment

8. User sees result
   └─ New equipment appears in table
   └─ Form closes
   └─ Success indication (implicit via new row)
```

---

## Performance Considerations

```
Frontend Optimization
├─ React.memo on list items
├─ useMemo for filtered results
├─ useCallback for event handlers
├─ Lazy loading of routes (future)
└─ Image optimization (future)

Backend Optimization
├─ MongoDB indexes (future)
├─ Query pagination (future)
├─ Response caching (future)
├─ Gzip compression (future)
└─ Database connection pooling

Network Optimization
├─ Minimize API calls
├─ Batch related requests
├─ Debounce search input
├─ Cache tokens in localStorage
└─ CDN for static assets (production)
```

---

## Security Measures

```
Authentication
├─ JWT tokens with expiry (7 days)
├─ bcrypt password hashing (10 rounds)
└─ Token stored in localStorage

Authorization
├─ Role-based access control (admin, manager, technician)
├─ Team-based access (can only pick from own team)
└─ User ownership validation

Data Protection
├─ CORS enabled (configurable origins)
├─ HTTP headers security (future)
├─ SQL injection prevention (MongoDB/Mongoose)
└─ XSS prevention (React escaping)

Input Validation
├─ Client-side validation
├─ Server-side schema validation
└─ Type checking (Mongoose)
```

---

This architecture provides a complete, scalable, and maintainable system for equipment maintenance management.
