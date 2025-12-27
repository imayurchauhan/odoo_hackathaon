import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function Dashboard(){
  const { user } = useAuth();
  const [stats, setStats] = useState({ equipment: 0, requests: 0, inProgress: 0, overdue: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [eqRes, reqRes] = await Promise.all([api.get('/equipment'), api.get('/maintenance')]);
      const eq = eqRes.data;
      const reqs = reqRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      
      const inProg = reqRes.data.filter(r => r.status === 'in_progress').length;
      const overdue = reqRes.data.filter(r => r.dueAt && new Date(r.dueAt) < new Date() && !['repaired','scrap'].includes(r.status)).length;
      
      setStats({ equipment: eq.length, requests: reqRes.data.length, inProgress: inProg, overdue });
      setRequests(reqs);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome to GearGuard - Your maintenance management system</p>
          {user?.role === 'technician' && user?.team && (
            <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
              👥 Team: {typeof user.team === 'string' ? user.team : user.team.name || 'Unknown'}
            </p>
          )}
        </div>
        <button className="btn btn-primary" onClick={load} title="Refresh data">
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⚙️</span>
            <span className="stat-title">Total Equipment</span>
          </div>
          <div className="stat-value">{stats.equipment}</div>
          <div className="stat-bar" style={{background: '#00d4ff'}}></div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📋</span>
            <span className="stat-title">All Requests</span>
          </div>
          <div className="stat-value">{stats.requests}</div>
          <div className="stat-bar" style={{background: '#00ff88'}}></div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⚡</span>
            <span className="stat-title">In Progress</span>
          </div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-bar" style={{background: '#ffa500'}}></div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon\">⚠️</span>
            <span className="stat-title">Overdue</span>
          </div>
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-bar" style={{background: '#ff6b6b'}}></div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="recent-requests-card">
        <div className="card-header">
          <h2>Recent Requests</h2>
          <a href="/requests" className="view-all">View All →</a>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading requests...</div>
        ) : requests.length > 0 ? (
          <div className="requests-list">
            {requests.map(req => {
              const isOverdue = req.dueAt && new Date(req.dueAt) < new Date() && !['repaired','scrap'].includes(req.status);
              return (
                <div key={req._id} className={`request-item ${isOverdue ? 'overdue' : ''}`}>
                  <div className="request-left">
                    <div className="request-title">{req.title}</div>
                    <div className="request-meta">
                      <span className="equipment-badge">⚙️ {req.equipment?.name || 'Unknown'}</span>
                      {req.dueAt && (
                        <span className="date-badge">📅 {new Date(req.dueAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="request-right">
                    <span className={`status-badge status-${getStatusColor(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                    {isOverdue && <span className="overdue-indicator">⚠️ Overdue</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No maintenance requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
