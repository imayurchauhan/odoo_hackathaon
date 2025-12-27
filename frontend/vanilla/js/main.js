/* ===== DUMMY DATA ===== */
const dummyData = {
  equipment: [
    { id: 1, name: 'Pump Motor A', serial: 'PM-2024-001', department: 'Production', team: 'Team Alpha', tech: 'Mike Johnson', warranty: '2025-06', location: 'Building A, Floor 2' },
    { id: 2, name: 'Drill Press B', serial: 'DP-2024-002', department: 'Production', team: 'Team Beta', tech: 'Sarah Lee', warranty: '2025-12', location: 'Building B, Floor 1' },
    { id: 3, name: 'Lathe C', serial: 'LC-2024-003', department: 'Manufacturing', team: 'Team Gamma', tech: 'James Park', warranty: '2024-09', location: 'Building A, Floor 3' }
  ],
  requests: [
    { id: 1, title: 'Pump Motor A - Bearing Replacement', equipment: 'Pump Motor A', status: 'in_progress', priority: 'high', type: 'corrective', description: 'Replace worn bearing in pump motor A', assigned: 'Mike Johnson' },
    { id: 2, title: 'Drill Press B - Calibration', equipment: 'Drill Press B', status: 'repaired', priority: 'medium', type: 'preventive', description: 'Calibrate drill press precision', assigned: 'Sarah Lee' },
    { id: 3, title: 'Lathe C - Oil Refill', equipment: 'Lathe C', status: 'new', priority: 'low', type: 'corrective', description: 'Refill hydraulic oil', assigned: 'Unassigned' }
  ],
  teams: [
    { id: 1, name: 'Team Alpha', desc: 'Production floor maintenance', members: ['Mike Johnson', 'Lisa Chen', 'Tom Wilson'] },
    { id: 2, name: 'Team Beta', desc: 'Manufacturing equipment', members: ['Sarah Lee', 'David Brown'] },
    { id: 3, name: 'Team Gamma', desc: 'Hydraulics and precision tools', members: ['James Park', 'Emma Davis', 'Robert Miller'] }
  ]
};

// Events for calendar
const calendarEvents = {
  '2024-12-15': { type: 'preventive', title: 'Pump Motor Maintenance' },
  '2024-12-20': { type: 'corrective', title: 'Drill Press Repair' },
  '2024-12-25': { type: 'preventive', title: 'Scheduled Calibration' },
  '2025-01-05': { type: 'corrective', title: 'Oil System Check' },
  '2025-01-10': { type: 'preventive', title: 'Quarterly Inspection' }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupModalHandlers();
  setupKanbanDragDrop();
  setupCalendar();
  loadDashboard();
}

// ===== NAVIGATION =====
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = item.dataset.page;
      navigateToPage(pageName);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function navigateToPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const page = document.getElementById(pageName);
  if (page) {
    page.classList.add('active');
    
    // Load page-specific data
    switch(pageName) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'equipment':
        loadEquipment();
        break;
      case 'requests':
        loadRequests();
        break;
      case 'teams':
        loadTeams();
        break;
    }
  }
}

// ===== DASHBOARD =====
function loadDashboard() {
  const totalEquip = dummyData.equipment.length;
  const openReqs = dummyData.requests.filter(r => r.status !== 'repaired').length;
  const overdueReqs = Math.floor(openReqs * 0.375); // 37.5%
  const activeTechs = new Set(dummyData.requests.map(r => r.assigned).filter(a => a !== 'Unassigned')).size + 1;
  
  document.getElementById('totalEquipment').textContent = totalEquip;
  document.getElementById('openRequests').textContent = openReqs;
  document.getElementById('overdueRequests').textContent = overdueReqs;
  document.getElementById('activeTechs').textContent = activeTechs;
}

// ===== EQUIPMENT =====
function loadEquipment() {
  const tbody = document.getElementById('equipmentTable');
  tbody.innerHTML = dummyData.equipment.map(eq => `
    <tr>
      <td>${eq.name}</td>
      <td>${eq.serial}</td>
      <td>${eq.department}</td>
      <td>${eq.team}</td>
      <td>${eq.tech}</td>
      <td>${eq.warranty}</td>
      <td>${eq.location}</td>
      <td><button class="btn-sm" onclick="openEquipmentModal('${eq.name}')">Details</button></td>
    </tr>
  `).join('');
}

function openEquipmentModal(equipName) {
  const modal = document.getElementById('equipmentModal');
  document.getElementById('equipmentName').textContent = equipName;
  modal.classList.add('active');
}

function closeEquipmentModal() {
  document.getElementById('equipmentModal').classList.remove('active');
}

// Add Equipment Button
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addEquipmentBtn');
  if (addBtn) addBtn.addEventListener('click', () => alert('Add Equipment form coming soon!'));
});

// ===== REQUESTS =====
function loadRequests() {
  const container = document.getElementById('requestsList');
  container.innerHTML = dummyData.requests.map(req => {
    const statusClass = req.status === 'in_progress' ? 'badge-info' : req.status === 'repaired' ? 'badge-success' : 'badge-default';
    const priorityClass = req.priority === 'high' ? 'badge-warning' : req.priority === 'medium' ? 'badge-info' : 'badge-success';
    return `
      <article class="request-card">
        <div class="request-header">
          <h3>${req.title}</h3>
          <span class="badge ${priorityClass}">${req.priority.charAt(0).toUpperCase() + req.priority.slice(1)} Priority</span>
        </div>
        <p class="request-description">${req.description}</p>
        <div class="request-meta">
          <span><strong>Status:</strong> <span class="badge ${statusClass}">${req.status === 'in_progress' ? 'In Progress' : req.status === 'repaired' ? 'Repaired' : 'New'}</span></span>
          <span><strong>Assigned:</strong> ${req.assigned}</span>
        </div>
        <div class="request-footer">
          <button class="btn-sm" onclick="alert('Viewing request: ${req.title}')">View</button>
        </div>
      </article>
    `;
  }).join('');
}

// ===== MODALS =====
function setupModalHandlers() {
  const addRequestBtn = document.getElementById('addRequestBtn');
  if (addRequestBtn) {
    addRequestBtn.addEventListener('click', () => {
      document.getElementById('requestModal').classList.add('active');
    });
  }

  const addTeamBtn = document.getElementById('addTeamBtn');
  if (addTeamBtn) {
    addTeamBtn.addEventListener('click', () => alert('Add Team form coming soon!'));
  }

  // Close modals on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
}

function closeRequestModal() {
  document.getElementById('requestModal').classList.remove('active');
}

function handleRequestSubmit(event) {
  event.preventDefault();
  alert('Request created successfully!');
  closeRequestModal();
}

// ===== KANBAN DRAG & DROP =====
function setupKanbanDragDrop() {
  let draggedElement = null;

  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedElement = card;
      card.style.opacity = '0.5';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
  });

  document.querySelectorAll('.kanban-list').forEach(list => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      list.style.background = 'rgba(0, 212, 255, 0.05)';
    });

    list.addEventListener('dragleave', () => {
      list.style.background = '';
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedElement) {
        list.appendChild(draggedElement);
        list.style.background = '';
        draggedElement = null;
        
        // Show notification
        const status = list.closest('.kanban-column').querySelector('.column-header').textContent;
        showNotification(`Task moved to ${status}`);
      }
    });
  });
}

// ===== CALENDAR =====
function setupCalendar() {
  let currentDate = new Date(2024, 11); // December 2024
  renderCalendar(currentDate);

  document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });
}

function renderCalendar(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tbody = document.getElementById('calendarBody');
  tbody.innerHTML = '';

  let row = document.createElement('tr');
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (row.children.length === 7) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }

    const cell = document.createElement('td');
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    cell.innerHTML = `<div class="calendar-date">${day}</div>`;

    // Add event if exists
    if (calendarEvents[dateStr]) {
      const event = calendarEvents[dateStr];
      const eventClass = event.type === 'preventive' ? 'event-preventive' : 'event-corrective';
      cell.innerHTML += `<div class="calendar-event ${eventClass}">${event.title}</div>`;
    }

    cell.style.cursor = 'pointer';
    cell.addEventListener('click', () => {
      alert(`Create new request for ${dateStr}`);
    });

    row.appendChild(cell);
  }

  // Fill remaining cells
  while (row.children.length < 7) {
    row.appendChild(document.createElement('td'));
  }
  tbody.appendChild(row);
}

// ===== TEAMS =====
function loadTeams() {
  // Teams are already loaded in HTML, can be made dynamic later
  console.log('Teams page loaded');
}

// ===== UTILITIES =====
function showNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--primary);
    color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 2000;
    animation: slideInUp 0.3s ease;
  `;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOutDown 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideOutDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ===== FILTERS =====
document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');

  [statusFilter, priorityFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', () => {
        filterRequests();
      });
    }
  });
});

function filterRequests() {
  const statusVal = document.getElementById('statusFilter')?.value;
  const priorityVal = document.getElementById('priorityFilter')?.value;
  const cards = document.querySelectorAll('.request-card');

  cards.forEach(card => {
    let show = true;
    
    if (statusVal) {
      const status = card.textContent.includes('In Progress') ? 'in_progress' : 
                     card.textContent.includes('Repaired') ? 'repaired' : 'new';
      show = show && status === statusVal;
    }

    if (priorityVal) {
      show = show && card.textContent.toLowerCase().includes(priorityVal);
    }

    card.style.display = show ? 'block' : 'none';
  });
}

// ===== SEARCH FUNCTIONALITY =====
const searchBar = document.querySelector('.search-bar');
if (searchBar) {
  searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const requestCards = document.querySelectorAll('.request-card');
    
    requestCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'block' : 'none';
    });
  });
}

// ===== PAGE LOAD EFFECTS =====
window.addEventListener('load', () => {
  // Initialize with dashboard
  navigateToPage('dashboard');
});
