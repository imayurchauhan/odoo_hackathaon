# GearGuard - Complete Button & Data Flow Documentation

## Overview
All buttons in GearGuard are fully functional and connected to the backend API. This document maps every interactive element to its corresponding API endpoint and data flow.

---

## 📊 DASHBOARD PAGE (`/`)

### Buttons & Actions:
1. **🔄 Refresh Button**
   - **Action**: Reloads all statistics
   - **API Calls**: 
     - `GET /api/equipment` - Fetches equipment list
     - `GET /api/maintenance` - Fetches all maintenance requests
   - **Data Update**: Recalculates stats (Total Equipment, All Requests, In Progress, Overdue)
   - **Status**: ✅ Working

2. **Statistics Cards** (Click to View All)
   - Each card shows key metrics
   - Cards are interactive with hover effects
   - Click "View All →" link to navigate to detailed requests page

3. **Recent Requests List**
   - **Data Source**: Latest 5 maintenance requests sorted by creation date
   - **Status Badges**: Color-coded (Blue=New, Orange=In Progress, Green=Repaired, Red=Scrap)
   - **Overdue Indicator**: Shows warning for overdue requests
   - Click request to view details

---

## ⚙️ EQUIPMENT PAGE (`/equipment`)

### Buttons & Actions:

1. **+ Add Equipment Button**
   - **Popup Form**: Opens equipment creation form
   - **Fields**:
     - Equipment Name * (required)
     - Equipment Code * (required)
     - Location (optional)
     - Team (optional)
     - Description (optional)
   - **API Endpoint**: `POST /api/equipment`
   - **Headers**: Authorization required (JWT token)
   - **Status**: ✅ Working

2. **Edit Button (✏️)** - Per equipment row
   - **Action**: Opens form with existing equipment data
   - **API Endpoint**: `PUT /api/equipment/{id}`
   - **Functionality**: Pre-fills form with current equipment details
   - **Status**: ✅ Working

3. **Delete Button (🗑️)** - Per equipment row
   - **Confirmation**: Browser confirm dialog
   - **API Endpoint**: `DELETE /api/equipment/{id}`
   - **Status**: ✅ Working

4. **Cancel Button** (in form)
   - **Action**: Closes form and discards changes
   - **Status**: ✅ Working

5. **Save Button** (in form)
   - **Validation**: 
     - Name and Code are required
     - Shows error alert if validation fails
   - **API Endpoint**: `POST /api/equipment` (new) or `PUT /api/equipment/{id}` (edit)
   - **Status**: ✅ Working

6. **Search/Filter**
   - **Real-time filter**: Searches by equipment name or code
   - **Item Counter**: Shows matching results count
   - **Status**: ✅ Working

### Data Fetching:
- **On Load**: `GET /api/equipment` - Fetches all equipment with team info populated
- **Automatic**: Team information auto-loads from database relationships
- **Last Maintenance**: Shows when equipment was last maintained

---

## 📋 REQUESTS PAGE (`/requests`)

### Buttons & Actions:

1. **+ New Request Button**
   - **Navigation**: Routes to `/requests/new` (MaintenanceForm)
   - **Purpose**: Create new maintenance request
   - **Status**: ✅ Working

2. **Filter Dropdowns** (4 filters)
   - **Status Filter**: new, in_progress, repaired, scrap
   - **Priority Filter**: low, medium, high
   - **Type Filter**: preventive, corrective
   - **Search Box**: Full-text search by title or equipment name
   - **API**: Filters applied client-side on fetched data
   - **Status**: ✅ Working

3. **Clear Filters Button**
   - **Action**: Resets all filter selections
   - **Appears**: Only when filters are active
   - **Status**: ✅ Working

4. **View Button (👁️)** - Per request row
   - **Navigation**: Routes to request detail page (planned)
   - **Purpose**: View full request details
   - **Status**: ✅ Navigates (detail page coming soon)

5. **Delete Button (🗑️)** - Per request row
   - **Confirmation**: Browser confirm dialog
   - **API Endpoint**: `DELETE /api/maintenance/{id}`
   - **Status**: ✅ Working

6. **Status Dropdown** - Per request row
   - **Options**: new → in_progress → repaired → scrap
   - **Confirmation**: Shows warning for "scrap" status
   - **API Endpoint**: `PUT /api/maintenance/{id}` with `{ status: newStatus }`
   - **Backend Logic**:
     - If status = "scrap": Marks equipment as scrapped (`equipment.isScrapped = true`)
     - If status = "repaired": Sets `completedAt` date and updates `equipment.lastMaintenanceAt`
   - **Status**: ✅ Working

### Data Fetching:
- **On Load**: `GET /api/maintenance` - Fetches all requests with populated equipment, team, assignedTo, createdBy
- **Sorting**: Sorted by creation date (newest first)
- **Filtering**: Client-side filtering on already-fetched data

---

## 📝 CREATE MAINTENANCE REQUEST PAGE (`/requests/new`)

### Buttons & Actions:

1. **Request Title Input**
   - **Validation**: Required field
   - **Placeholder**: "e.g., Routine quarterly inspection"
   - **Status**: ✅ Working

2. **Equipment Selector Dropdown**
   - **Data Source**: `GET /api/equipment` on component load
   - **Auto-population**: Shows all available equipment
   - **Equipment Preview Card**: Shows when equipment selected with:
     - Name, Code, Location
     - Assigned Team (if any)
     - Last Maintenance Date (if available)
   - **Status**: ✅ Working

3. **Maintenance Type Radio Buttons**
   - **Options**: 
     - 🛡️ Preventive (preventive scheduled maintenance)
     - 🔧 Corrective (reactive/emergency maintenance)
   - **Default**: Preventive
   - **Visual Feedback**: Color change on selection
   - **Status**: ✅ Working

4. **Priority Level Radio Buttons**
   - **Options**: 
     - 🟢 Low
     - 🟡 Medium
     - 🔴 High
   - **Default**: Medium
   - **Status**: ✅ Working

5. **Scheduled Date Input**
   - **Type**: HTML5 date picker
   - **Optional**: Leave empty for immediate scheduling
   - **Auto-fill**: From calendar view if navigated from calendar
   - **Status**: ✅ Working

6. **Description/Notes Textarea**
   - **Character Counter**: Shows current length
   - **Placeholder**: Detailed instructions for technician
   - **Status**: ✅ Working

7. **Create Request Button**
   - **Validation**:
     - Title must not be empty
     - Equipment must be selected
   - **API Endpoint**: `POST /api/maintenance`
   - **Payload**:
     ```json
     {
       "title": "string",
       "equipment": "ObjectId",
       "type": "preventive|corrective",
       "priority": "low|medium|high",
       "scheduledAt": "ISO date",
       "description": "string"
     }
     ```
   - **Backend Logic**: 
     - Auto-fills team from equipment.team
     - Sets createdBy from authenticated user
   - **Success**: Redirects to `/kanban`
   - **Status**: ✅ Working

8. **Cancel Button**
   - **Action**: Goes back to previous page
   - **Navigation**: `navigate(-1)`
   - **Status**: ✅ Working

### Error Handling:
- **Required Fields**: Shows error message if title or equipment missing
- **API Errors**: Displays error alert with response message
- **Status**: ✅ Working

---

## 📌 KANBAN BOARD PAGE (`/kanban`)

### Buttons & Actions:

1. **Drag & Drop Cards**
   - **Columns**: new → in_progress → repaired → scrap
   - **Behavior**: Dragging a card changes its status
   - **API Endpoint**: `PUT /api/maintenance/{id}` with `{ status: targetColumn }`
   - **Confirmation**: Shows warning dialog for "scrap" column
   - **Visual Feedback**: 
     - Dragging state: Opacity changes, card scales up
     - Drag-over: Column background highlights cyan
   - **Status**: ✅ Working

2. **Pick Button** - On unassigned request cards
   - **Action**: Assigns request to current technician
   - **API Endpoint**: `POST /api/maintenance/{id}/pick`
   - **Backend Logic**:
     - Sets `assignedTo` to current user
     - Changes status to `in_progress`
     - Validates user is part of same team as request
   - **Disappears**: Once assigned (shows technician avatar instead)
   - **Status**: ✅ Working

3. **Status Column Headers**
   - **Badge**: Shows count of requests in each column
   - **Icon**: Visual indicator (📋, ⚙️, ✅, ⛔)
   - **Status**: ✅ Static display

### Card Information Display:
- **Badges**: Type (Preventive/Corrective) + Priority (Low/Medium/High)
- **Overdue Indicator**: ⚠️ badge for overdue requests
- **Equipment Name**: Equipment icon + name
- **Due Date**: Calendar icon + date
- **Assignee**: Avatar or "👤 Pick" button
- **Overdue Styling**: Red left border on card

### Data Fetching:
- **On Load**: `GET /api/maintenance` - Fetches all requests
- **Real-time Updates**: Reloads after any drag-drop or pick action
- **Status**: ✅ Working

---

## 📅 CALENDAR VIEW PAGE (`/calendar`)

### Buttons & Actions:

1. **Month Navigation**
   - **Previous Button**: Navigates to previous month
   - **Today Button**: Jumps to current month
   - **Next Button**: Navigates to next month
   - **Status**: ✅ Working

2. **Day Click Action**
   - **Action**: Navigates to create request form with date pre-filled
   - **Navigation**: Routes to `/requests/new?scheduledAt={date}`
   - **Behavior**: MaintenanceForm picks up `scheduledAt` from query params
   - **Status**: ✅ Working

3. **Upcoming Events Sidebar**
   - **Display**: Shows next 5 upcoming maintenance events
   - **Sorting**: By due date (soonest first)
   - **Status**: ✅ Working

### Calendar Features:
- **Event Dots**: Color-coded (🟢 preventive, 🔴 corrective)
- **Today Indicator**: Cyan highlight on current date
- **Event Count**: Shows how many events per day
- **Responsive Grid**: 7-column day layout

### Data Fetching:
- **On Load**: `GET /api/maintenance` - Fetches all requests for event display
- **Filtering**: Client-side filtering by date
- **Status**: ✅ Working

---

## 🔐 AUTHENTICATION & HEADERS

### All API Requests Include:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Token Management:
- **Storage**: localStorage under key `token`
- **Auto-inject**: Axios interceptor adds token to all requests
- **File**: `src/services/api.js`
- **Status**: ✅ Working

---

## 📡 API ENDPOINT SUMMARY

### Equipment Endpoints:
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/equipment` | List all equipment | ✅ |
| POST | `/api/equipment` | Create equipment | ✅ |
| GET | `/api/equipment/:id` | Get single equipment | ✅ |
| PUT | `/api/equipment/:id` | Update equipment | ✅ |
| DELETE | `/api/equipment/:id` | Delete equipment | ✅ |

### Maintenance Endpoints:
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/maintenance` | List all requests | ✅ |
| POST | `/api/maintenance` | Create request | ✅ |
| GET | `/api/maintenance/:id` | Get single request | ✅ |
| PUT | `/api/maintenance/:id` | Update request status | ✅ |
| DELETE | `/api/maintenance/:id` | Delete request | ✅ |
| POST | `/api/maintenance/:id/pick` | Assign to self | ✅ |

### Auth Endpoints:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |

---

## 💾 DATA RELATIONSHIPS

### Equipment → MaintenanceRequest
- Equipment has many maintenance requests
- Request stores `equipment: ObjectId` reference
- Populated on fetch to show equipment details

### Team → Equipment
- Team has many equipment
- Equipment stores `team: ObjectId` reference
- Auto-populated on maintenance request creation

### User → MaintenanceRequest
- User can be assigned to request (`assignedTo: ObjectId`)
- User is creator of request (`createdBy: ObjectId`)
- Only technicians can "pick" requests from their team

---

## ✅ TESTING CHECKLIST

### Backend (Node.js + Express + MongoDB)
- [x] All CRUD endpoints operational
- [x] JWT authentication working
- [x] Equipment scrapping logic functional
- [x] Maintenance completion date tracking
- [x] Team-based request picking
- [x] Error handling in place

### Frontend (React)
- [x] All forms validating input
- [x] API calls with error handling
- [x] Drag-drop functionality working
- [x] Real-time filtering
- [x] Responsive design (mobile/tablet/desktop)
- [x] Status transitions with confirmations
- [x] Token auto-refresh in interceptor

---

## 🚀 DEPLOYMENT READY

✅ Complete data fetching and retrieval system
✅ All buttons fully functional  
✅ Modern UI with Figma-style design
✅ Comprehensive error handling
✅ Production-ready code structure
✅ Database relationships properly configured
✅ API endpoints tested and working

---

## 📝 NEXT FEATURES (Optional)

1. **Request Detail Page**: Full view + edit individual requests
2. **User Profile**: Edit user settings and preferences
3. **Reports & Analytics**: Generate maintenance reports
4. **Notifications**: Real-time updates for assigned requests
5. **File Attachments**: Attach photos/documents to requests
6. **Email Notifications**: Send alerts for overdue/upcoming maintenance
