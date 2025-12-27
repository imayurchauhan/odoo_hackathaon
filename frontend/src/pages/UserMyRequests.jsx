import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UserMyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    load();
  }, []);

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

  const getStatusColor = (status) => {
    const colors = { new: '#3b82f6', in_progress: '#f59e0b', repaired: '#10b981', scrap: '#ef4444' };
    return colors[status] || '#666';
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const filteredRequests = requests.filter(r => {
    if (filters.status && r.status !== filters.status) return false;
    if (filters.search && !r.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: 8 }}>My Maintenance Requests</h1>
            <p style={{ color: '#666', margin: 0 }}>Track the status of your submitted requests</p>
          </div>
          <button
            onClick={() => navigate('/user-create-request')}
            style={{
              padding: '10px 20px',
              background: '#0077ff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + New Request
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            placeholder="Search by subject..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            style={{ flex: 1, padding: 10, border: '1px solid #e0e0e0', borderRadius: 6 }}
          />
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={{ padding: 10, border: '1px solid #e0e0e0', borderRadius: 6, minWidth: 150 }}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="repaired">Repaired</option>
            <option value="scrap">Scrapped</option>
          </select>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#666' }}>Loading requests...</div>}

      {filteredRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          <p style={{ margin: 0 }}>No requests found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredRequests.map(req => (
            <div
              key={req._id}
              onClick={() => navigate(`/request/${req._id}`)}
              style={{
                background: '#fff',
                padding: 16,
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'grid',
                gridTemplateColumns: '1fr 150px 100px 150px',
                alignItems: 'center',
                gap: 16
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600 }}>{req.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{req.equipment?.name || 'Unknown'}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#666' }}>{req.type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective'}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: getStatusColor(req.status) + '20',
                    color: getStatusColor(req.status),
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {getStatusLabel(req.status)}
                </span>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#999' }}>
                {new Date(req.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
