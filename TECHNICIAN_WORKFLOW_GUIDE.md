# 🔧 Technician Workflow Guide

This guide covers the complete technician workflow in GearGuard - from logging in to completing maintenance requests.

---

## Table of Contents
1. [Login & Dashboard](#login--dashboard)
2. [Kanban Board (My Tasks)](#kanban-board-my-tasks)
3. [Requests List](#requests-list)
4. [Request Detail & Actions](#request-detail--actions)
5. [Troubleshooting](#troubleshooting)

---

## Login & Dashboard

### Step 1: Login as Technician
- Navigate to **Login** page
- Use test credentials:
  - **Email**: `tech@test.com`
  - **Password**: `password123`
  
### Step 2: Dashboard Overview
Once logged in, you'll see:
- **Dashboard** showing stats:
  - Total Equipment count
  - All Requests (system-wide count)
  - In Progress requests
  - Overdue requests
- **Team Info** displayed below the subtitle (e.g., "👥 Team: Alpha Team")
- **Recent Requests** list at the bottom

### Navigation Menu
The left sidebar shows technician-specific options:
- **⚙️ My Tasks** → Opens Kanban board (drag-and-drop interface)
- **📋 Requests** → Shows filtered list of your team's requests

---

## Kanban Board (My Tasks)

The Kanban board displays your team's maintenance requests in three columns:

### Columns
1. **📋 New** - Requests not yet assigned or started
2. **⚙️ In Progress** - Requests you are currently working on
3. **✅ Repaired** - Completed requests

### Workflow

#### Option A: Pick a Request (Auto-Assign)
1. Click **👤 Pick** button on an unassigned request in the New column
2. The request moves to **In Progress** and assigns to you
3. No duration input needed for picking

#### Option B: Drag to Start Working
1. Drag a New request card to the **In Progress** column
2. If the request is unassigned:
   - The Pick endpoint is called automatically
   - You are assigned as the technician
   - Request status changes to `in_progress`
3. If already assigned (to you):
   - Status changes to `in_progress`

#### Move to Repaired (with Duration)
1. When work is complete, drag the card from **In Progress** to **Repaired**
2. A **Duration Modal** will appear asking for time spent in hours
   - Example input: `2.5` (for 2.5 hours)
   - Must be a positive number
   - Decimal inputs are supported
3. Click **Save** to confirm
4. The request is marked as repaired and duration is recorded

### Card Information
Each card shows:
- **Title** of the maintenance request
- **Badges**:
  - Type: 🛡️ Preventive or 🔧 Corrective
  - Priority: 🟢 Low, 🟡 Medium, 🔴 High
- **Equipment**: ⚙️ Equipment name
- **Due Date**: 📅 (if set)
- **Assignee**: Avatar + name (or Pick button if unassigned)
- **Overdue Indicator**: ⚠️ if past due date

---

## Requests List

Access via **📋 Requests** in the sidebar.

### Features
- **Search**: Filter by title or equipment name
- **Status Filter**: All Status, New, In Progress, Repaired, Scrapped
- **Priority Filter**: All Priorities, Low, Medium, High
- **Type Filter**: All Types, Preventive, Corrective

### Actions on Each Request
- Click any request to open **Request Detail** page
- Status changes are restricted based on business rules
- Only your team's requests are visible

---

## Request Detail & Actions

Click on any request card or list item to open the detail view.

### Information Displayed
- **Title** and Request ID
- **Status badge** (color-coded)
- **Equipment** details (name, code)
- **Team** assigned to this request
- **Request Type** (Preventive/Corrective)
- **Priority** (Low/Medium/High)
- **Assigned To** (technician name)
- **Created** date
- **Created By** (original requester)
- **Description** of work needed

### Technician Actions

#### When Status = "New" (Unassigned)
- **👤 Pick Request** button
  - Assigns the request to you
  - Changes status to `in_progress`
  - Moves to the In Progress column on Kanban

#### When Status = "In Progress" (Assigned to You)
- **🟡 Mark In Progress** button
  - Confirms you are actively working on the request
  - (Only appears if request is assigned to you)

#### When Status = "In Progress" (After You Started)
- **🟢 Mark Repaired (Enter Duration)** button
  - Opens the Duration Modal
  - Enter hours spent (e.g., `2.5`)
  - Click **Save** to confirm
  - Status changes to `repaired`
  - Duration is recorded in the system

### Navigation
- **← Back** button to return to the previous view
- Refresh data anytime using the header Refresh button

---

## Troubleshooting

### Issue: "Invalid credentials" on login
**Solution:**
- Verify email is exactly `tech@test.com` (case-sensitive)
- Verify password is `password123`
- Check that backend seed was run: `npm run seed` in the backend folder

### Issue: Technician assigned to wrong team
**Solution:**
- Open browser DevTools Console
- Check if `localStorage.getItem('user')` shows the correct `team` field
- If not, logout and login again
- Verify seed script assigned technician to correct team

### Issue: Can't see any requests in Kanban/Requests
**Solution:**
- Ensure seed was run: `node seed.js` in backend
- Check MongoDB is running
- Verify backend is returning requests: `GET /maintenance` in Postman/curl
- Backend console should show "Connecting to MongoDB at..." with the URI

### Issue: Duration Modal doesn't appear when dragging to Repaired
**Solution:**
- Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
- Refresh the page: Ctrl+R (or Cmd+R on Mac)
- Verify frontend is built: `npm start` should show "Compiled successfully"

### Issue: Drag-and-drop not working
**Solution:**
- Ensure `react-beautiful-dnd` is installed: `npm list react-beautiful-dnd`
- If not installed, run: `npm install react-beautiful-dnd`
- Restart frontend with `npm start`

### Issue: Backend API calls failing (network errors)
**Solution:**
- Verify backend is running: `npm run dev` in backend folder
- Check backend console for errors
- Verify REACT_APP_API_URL in frontend (should be `http://localhost:3001` or match backend port)
- Check browser DevTools Network tab to see actual error response

---

## Quick Test Steps

### Full End-to-End Test
1. **Start Backend**
   ```bash
   cd backend
   npm run seed
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

3. **Login**
   - Email: `tech@test.com`
   - Password: `password123`

4. **Test Kanban Workflow**
   - Go to **⚙️ My Tasks**
   - Click **👤 Pick** on a New request
   - Verify it moves to In Progress

5. **Test Duration Input**
   - Drag an In Progress request to Repaired
   - Enter duration (e.g., `2.5`)
   - Verify status changes

6. **Test Request Detail**
   - Go to **📋 Requests**
   - Click on a request
   - Try the action buttons (Pick, Mark In Progress, Mark Repaired)
   - Verify duration modal appears

---

## API Endpoints Used

The technician workflow uses these backend endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/maintenance` | List technician's team requests |
| `GET` | `/maintenance/:id` | Get request details |
| `POST` | `/maintenance/:id/pick` | Assign request to you |
| `PUT` | `/maintenance/:id` | Update status/duration |

All requests require:
- **Authorization**: Bearer token (auto-attached by axios interceptor)
- Technicians can only:
  - See requests for their team
  - Update only their team's requests
  - Pick and mark in_progress/repaired only if assigned to them

---

## Success Indicators

✅ Technician is logged in with correct role badge  
✅ Dashboard shows team info  
✅ Kanban shows requests from technician's team  
✅ Pick button works and auto-assigns request  
✅ Drag to In Progress works  
✅ Drag to Repaired opens duration modal  
✅ Duration input accepts decimals (e.g., 2.5)  
✅ Request Detail shows all technician actions  
✅ All requests visible in Requests list  
✅ Logout works and redirects to login  

---

## Notes

- **Technician can only see** requests assigned to their team
- **Technician can only update** requests they are assigned to
- **Duration is required** when marking a request as repaired
- **Status transitions are strict**: New → In Progress → Repaired
- **No access** to Equipment, Admin, or Manager features
- **Team info** is stored in localStorage and decoded from JWT token

---

*Last Updated: December 27, 2025*
