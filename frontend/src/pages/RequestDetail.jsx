import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DurationModal from '../components/DurationModal';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [durationModalOpen, setDurationModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/maintenance/${id}`);
      setRequest(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (newStatus === 'scrap' && !window.confirm('Mark equipment as scrapped?')) return;
    if (newStatus === 'repaired') {
      setDurationModalOpen(true);
      return;
    }

    setUpdating(true);
    try {
      const payload = { status: newStatus };
      await api.put(`/maintenance/${id}`, payload);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Error updating request');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkRepaired = async (durationVal) => {
    setDurationModalOpen(false);
    setUpdating(true);
    try {
      await api.put(`/maintenance/${id}`, { status: 'repaired', duration: durationVal });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Error marking repaired');
    } finally {
      setUpdating(false);
    }
  };

  const pickRequest = async () => {
    setUpdating(true);
    try {
      await api.post(`/maintenance/${id}/pick`);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Error picking request');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { new: '#3b82f6', in_progress: '#f59e0b', repaired: '#10b981', scrap: '#ef4444' };
    return colors[status] || '#666';
  };

  const isTechnician = user?.role === 'technician';
  const isCreator = request?.createdBy?._id === user?.id || request?.createdBy === user?.id;

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>;
  if (error && !request) return <div style={{ padding: 32, textAlign: 'center', color: '#b00' }}>{error}</div>;
  if (!request) return <div style={{ padding: 32, textAlign: 'center' }}>Request not found</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#0077ff', cursor: 'pointer', fontSize: 14, marginBottom: 20 }}
      >
        ← Back
      </button>

      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {error && (
          <div style={{ background: '#fee', color: '#b00', padding: 12, borderRadius: 8, marginBottom: 20, border: '1px solid #fcc' }}>
            {error}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>{request.title}</h1>
            <span
              style={{
                padding: '6px 16px',
                background: getStatusColor(request.status) + '20',
                color: getStatusColor(request.status),
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {request.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
            Request ID: {request._id?.substring(0, 8) || 'N/A'}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Equipment</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.equipment?.name || 'N/A'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Equipment Code</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.equipment?.code || 'N/A'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Maintenance Team</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.team?.name || 'Not assigned'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Request Type</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Priority</label>
            <p style={{ margin: 0, fontSize: 15 }}>
              {request.priority === 'low' ? '🟢 Low' : request.priority === 'medium' ? '🟡 Medium' : '🔴 High'}
            </p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Assigned To</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.assignedTo?.name || 'Unassigned'}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Created</label>
            <p style={{ margin: 0, fontSize: 15 }}>{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Created By</label>
            <p style={{ margin: 0, fontSize: 15 }}>{request.createdBy?.name || 'Unknown'}</p>
          </div>
        </div>

        {/* Description */}
        {request.description && (
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e0e0e0' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>Description</label>
            <p style={{ margin: 0, fontSize: 14, whiteSpace: 'pre-wrap' }}>{request.description}</p>
          </div>
        )}

        {/* Technician Actions */}
        {isTechnician && (
          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15 }}>Technician Actions</h3>

            {request.status === 'new' && !request.assignedTo && (
              <button
                onClick={pickRequest}
                disabled={updating}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 12
                }}
              >
                {updating ? 'Picking...' : 'Pick Request'}
              </button>
            )}

            {(request.status === 'new' || request.status === 'in_progress') && request.assignedTo?._id === user?.id && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => updateStatus('in_progress')}
                  disabled={updating || request.status === 'in_progress'}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {updating ? 'Updating...' : 'Mark In Progress'}
                </button>
              </div>
            )}

            {request.status === 'in_progress' && request.assignedTo?._id === user?.id && (
              <button
                onClick={() => updateStatus('repaired')}
                disabled={updating}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '12px 24px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {updating ? 'Marking...' : 'Mark Repaired (Enter Duration)'}
              </button>
            )}
          </div>
        )}

        {/* User View - Read-only */}
        {!isTechnician && isCreator && (
          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 24, color: '#666', fontSize: 14 }}>
            Your request is being handled by the maintenance team. Check back for updates on the status.
          </div>
        )}

        <DurationModal
          open={durationModalOpen}
          title="Enter duration in hours (e.g. 2.5)"
          onCancel={() => setDurationModalOpen(false)}
          onConfirm={handleMarkRepaired}
        />
      </div>
    </div>
  );
}
