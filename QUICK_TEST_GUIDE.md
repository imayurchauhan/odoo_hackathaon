# GearGuard - Quick Test Guide

## Starting the Application

### 1. Start Backend (Port 5000)
```bash
cd backend
npm start
# Or with nodemon for development:
npm run dev
```

### 2. Seed Database (First time only)
```bash
cd backend
npm run seed
# Creates: 3 teams, 4 users, 3 equipment, 3 requests
```

### 3. Start Frontend (Port 3000)
```bash
cd frontend
npm start
```

### 4. Login
- **URL**: `http://localhost:3000`
- **Test Credentials**:
  ```
  Email: mike@gearguard.com
  Password: password123
  ```
  (Or use: admin@gearguard.com, sarah@gearguard.com, james@gearguard.com)

---

## Testing All Buttons

### Dashboard (`http://localhost:3000`)
1. ✅ **🔄 Refresh Button**
   - Click refresh, stats should reload
   - Should see "Total Equipment", "All Requests", "In Progress", "Overdue" counts

2. ✅ **Recent Requests List**
   - Should show latest 5 maintenance requests
   - Click "View All →" to go to requests page

---

### Equipment Page (`http://localhost:3000/equipment`)
1. ✅ **+ Add Equipment Button**
   - Click to open form
   - Fill in: Name, Code, Location, Team (optional), Description
   - Click "Add Equipment" to create
   - Should appear in table below

2. ✅ **Edit Button (✏️)**
   - Click edit on any equipment
   - Form should populate with current data
   - Modify and click "Update Equipment"

3. ✅ **Delete Button (🗑️)**
   - Click delete on any equipment
   - Confirm in dialog
   - Equipment should disappear from table

4. ✅ **Search/Filter**
   - Type in search box
   - Results should filter by name or code in real-time

5. ✅ **Stat Cards at Bottom**
   - Should show Total Equipment, Active, Scrapped counts

---

### Requests Page (`http://localhost:3000/requests`)
1. ✅ **+ New Request Button**
   - Click to navigate to maintenance form
   - Should redirect to `/requests/new`

2. ✅ **Filter Dropdowns**
   - Select different status values
   - Select priority level
   - Select maintenance type
   - Type in search box
   - Table should filter in real-time
   - Click "Clear Filters" to reset

3. ✅ **Status Dropdown (Per Row)**
   - Change from "new" → "in_progress"
   - Change to "repaired" (should set completion date)
   - Try "scrap" (should show confirmation dialog)
   - Should update immediately

4. ✅ **Delete Button (🗑️)**
   - Click delete on any request
   - Confirm in dialog
   - Should be removed from list

5. ✅ **View Button (👁️)**
   - Currently navigates to /requests/{id}
   - Detail page coming soon

---

### Create Request Page (`http://localhost:3000/requests/new`)
1. ✅ **Equipment Selector**
   - Click dropdown
   - Should show all available equipment
   - Select one
   - Equipment preview card should appear

2. ✅ **Type Radio Buttons**
   - Toggle between Preventive & Corrective
   - Should update visual style

3. ✅ **Priority Radio Buttons**
   - Toggle between Low, Medium, High
   - Should update visual style

4. ✅ **Scheduled Date**
   - Pick a date from date picker
   - Or leave empty for immediate

5. ✅ **Description Textarea**
   - Type description
   - Character counter should update

6. ✅ **Create Request Button**
   - Try without equipment (should show error)
   - Try without title (should show error)
   - Fill all required fields and click
   - Should redirect to Kanban board

---

### Kanban Board (`http://localhost:3000/kanban`)
1. ✅ **Drag & Drop Cards**
   - Drag card from "New" to "In Progress"
   - API should update status
   - Try dragging to "Scrap" (should show warning)
   - Column counts should update

2. ✅ **Pick Button** (On unassigned requests)
   - Click "👤 Pick" on any unassigned card
   - Should assign to logged-in user
   - Card should move to "In Progress"
   - "Pick" button should be replaced by your avatar

3. ✅ **Column Headers**
   - Should show count badges
   - Should show icons

4. ✅ **Overdue Indicators**
   - Requests with past due dates show ⚠️ Overdue
   - Have red left border

---

### Calendar View (`http://localhost:3000/calendar`)
1. ✅ **Month Navigation**
   - Click "Previous" (◀) to go back month
   - Click "Today" to return to current
   - Click "Next" (▶) to go forward month

2. ✅ **Day Click**
   - Click on any day in calendar
   - Should navigate to create request with date pre-filled
   - Check URL: `/requests/new?scheduledAt=YYYY-MM-DD`

3. ✅ **Event Indicators**
   - Days with events should show colored dots
   - 🟢 = Preventive, 🔴 = Corrective
   - Should show count of events per day

4. ✅ **Upcoming Events Sidebar**
   - Should list next 5 events by due date

---

## Verification Checklist

### Backend Working?
- [ ] Can start without errors
- [ ] MongoDB connects successfully
- [ ] Seed data created (check output)
- [ ] No CORS errors

### Frontend Working?
- [ ] React app loads at localhost:3000
- [ ] Can login with test credentials
- [ ] Sidebar navigation working
- [ ] All pages load without errors

### Data Fetching?
- [ ] Dashboard loads with real stats
- [ ] Equipment page shows seeded equipment
- [ ] Requests page shows seeded requests
- [ ] API calls visible in Network tab (DevTools)

### Buttons Functional?
- [ ] Can create equipment
- [ ] Can edit equipment
- [ ] Can delete equipment
- [ ] Can create requests
- [ ] Can change request status
- [ ] Can pick requests
- [ ] Can drag-drop on Kanban
- [ ] Can navigate calendar
- [ ] Can filter/search on all pages

### Data Persistence?
- [ ] Created equipment persists after refresh
- [ ] Created requests persist after refresh
- [ ] Status changes persist after refresh
- [ ] Check MongoDB with: `db.equipment.find()`, `db.maintenance_requests.find()`

---

## Troubleshooting

### Issue: "Cannot GET /api/equipment"
**Solution**: 
- Make sure backend is running on port 5000
- Check `.env` file exists with `PORT=5000`
- Run seed script to populate data

### Issue: "JWT token missing"
**Solution**:
- Check localStorage has `token` key
- Try logging out and logging back in
- Clear browser cache

### Issue: Equipment/Requests not updating
**Solution**:
- Check Network tab in DevTools for failed requests
- Check backend console for errors
- Make sure MongoDB is running

### Issue: Forms not submitting
**Solution**:
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check Network tab to see request details

---

## API Testing with Curl

### Get Authorization Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mike@gearguard.com","password":"password123"}'
```

### Get All Equipment
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/equipment
```

### Create Equipment
```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"New Equipment",
    "code":"EQ-999",
    "location":"Warehouse",
    "description":"Test equipment"
  }'
```

### Get All Requests
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/maintenance
```

### Update Request Status
```bash
curl -X PUT http://localhost:5000/api/maintenance/REQUEST_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

---

## Development Notes

- **Frontend**: `npm start` runs on http://localhost:3000
- **Backend**: `npm start` runs on http://localhost:5000
- **React DevTools**: Install React DevTools browser extension for debugging
- **Network Tab**: Check DevTools → Network tab for API calls
- **Console**: Check DevTools → Console for JavaScript errors
- **Database**: MongoDB connection string in `.env` file

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Update `MONGO_URI` to production database
- [ ] Update API_URL in frontend `.env`
- [ ] Build frontend: `npm run build`
- [ ] Test all buttons in production
- [ ] Set up error logging
- [ ] Configure HTTPS/SSL
- [ ] Set up database backups
