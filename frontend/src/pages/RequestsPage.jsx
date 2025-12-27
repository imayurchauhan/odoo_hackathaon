import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/requests.css';

export default function RequestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filters]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/maintenance');
      setRequests(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = requests;

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.search) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.equipment?.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request?')) {
      try {
        await api.delete(`/maintenance/${id}`);
        load();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === 'scrap') {
      const ok = window.confirm('Mark as SCRAP? This will scrapped the equipment.');
      if (!ok) return;
    }

    try {
      await api.put(`/maintenance/${id}`, { status: newStatus });
      load();
    } catch (e) {
      console.error(e);
      alert('Error updating request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'blue',
      in_progress: 'orange',
      repaired: 'green',
      scrap: 'red'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = { low: 'green', medium: 'orange', high: 'red' };
    return colors[priority] || 'gray';
  };

  const isOverdue = (request) => {
    return request.dueAt && new Date(request.dueAt) < new Date() && !['repaired', 'scrap'].includes(request.status);
  };

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div className="header-content">
          <h1>Maintenance Requests</h1>
          <p className="page-subtitle">View and manage all maintenance requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/requests/new')}>
          + New Request
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by title or equipment..."
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="repaired">Repaired</option>
            <option value="scrap">Scrapped</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.priority}
            onChange={e => setFilters({...filters, priority: e.target.value})}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="preventive">Preventive</option>
            <option value="corrective">Corrective</option>
          </select>
        </div>

        {(filters.status || filters.priority || filters.type || filters.search) && (
          <button
            className="btn btn-secondary"
            onClick={() => setFilters({status: '', priority: '', type: '', search: ''})}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-state">Loading requests...</div>
      ) : filteredRequests.length > 0 ? (
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Equipment</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req._id} className={isOverdue(req) ? 'overdue' : ''}>
                  <td className="title-cell">
                    <div className="title-content">
                      <span>{req.title}</span>
                      {isOverdue(req) && <span className="overdue-badge">⚠️ Overdue</span>}
                    </div>
                  </td>
                  <td>{req.equipment?.name || '—'}</td>
                  <td>
                    <span className={`badge type-${req.type}`}>
                      {req.type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge priority-${getPriorityColor(req.priority)}`}>
                      {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    {['technician','manager','admin'].includes(user?.role) ? (
                      <select
                        value={req.status}
                        onChange={e => handleStatusChange(req._id, e.target.value)}
                        className={`status-select status-${getStatusColor(req.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="repaired">Repaired</option>
                        <option value="scrap">Scrap</option>
                      </select>
                    ) : (
                      <span style={{color:'#666',fontWeight:600}}>{req.status.replace('_',' ').toUpperCase()}</span>
                    )}
                  </td>
                  <td>
                    {req.dueAt ? new Date(req.dueAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    {req.assignedTo ? (
                      <span className="assignee">{req.assignedTo.name}</span>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => navigate(`/request/${req._id}`)}
                      title="View details"
                    >
                      👁️
                    </button>
                    {['admin','manager'].includes(user?.role) && (
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(req._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No requests found</h3>
          <p>Create your first maintenance request to get started</p>
          <button className="btn btn-primary" onClick={() => navigate('/requests/new')}>
            + Create Request
          </button>
        </div>
      )}

      <div className="results-info">
        {filteredRequests.length > 0 && (
          <span className="result-count">Showing {filteredRequests.length} of {requests.length} requests</span>
        )}
      </div>
    </div>
  );
}