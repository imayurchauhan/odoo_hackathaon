import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ManagerCreatePreventive() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    equipment: '',
    type: 'preventive',
    scheduledAt: '',
    description: ''
  });
  const [equipment, setEquipment] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/equipment')
      .then(r => setEquipment(r.data))
      .catch(e => {
        console.error(e);
        setError('Failed to load equipment');
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Subject is required');
      return;
    }
    if (!selected) {
      setError('Please select equipment');
      return;
    }
    if (!form.scheduledAt) {
      setError('Scheduled date is required');
      return;
    }

    try {
      const payload = {
        title: form.title,
        equipment: selected._id,
        type: 'preventive',
        scheduledAt: form.scheduledAt,
        description: form.description,
        priority: 'medium'
      };
      await api.post('/maintenance', payload);
      navigate('/manager-calendar');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Error scheduling maintenance');
    }
  };

  const handleEquipmentChange = (e) => {
    const equipmentId = e.target.value;
    setForm({ ...form, equipment: equipmentId });
    const selectedEquipment = equipment.find(x => x._id === equipmentId);
    setSelected(selectedEquipment);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Schedule Preventive Maintenance</h1>
        <p style={{ color: '#666', margin: 0 }}>Plan routine maintenance for equipment</p>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#b00', padding: 12, borderRadius: 8, marginBottom: 24, border: '1px solid #fcc' }}>
          {error}
        </div>
      )}

      <form onSubmit={submit} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {/* Subject */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Subject *</label>
          <input
            type="text"
            placeholder="e.g., Quarterly oil change and inspection"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 14 }}
          />
        </div>

        {/* Equipment */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Equipment *</label>
          <select
            value={form.equipment}
            onChange={handleEquipmentChange}
            style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 14 }}
          >
            <option value="">-- Select equipment --</option>
            {equipment.map(eq => (
              <option key={eq._id} value={eq._id}>{eq.name} ({eq.code})</option>
            ))}
          </select>
        </div>

        {/* Auto-filled: Maintenance Type */}
        <div style={{ marginBottom: 20, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Maintenance Type</label>
          <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>🛡️ Preventive</p>
        </div>

        {/* Scheduled Date */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Scheduled Date *</label>
          <input
            type="date"
            value={form.scheduledAt}
            onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
            style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 14 }}
          />
        </div>

        {/* Auto-filled: Assigned Team */}
        {selected && selected.team && (
          <div style={{ marginBottom: 20, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Assigned Maintenance Team</label>
            <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>{selected.team.name || 'N/A'}</p>
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Description</label>
          <textarea
            placeholder="Describe the maintenance tasks..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows="4"
            style={{ width: '100%', padding: 10, border: '1px solid #e0e0e0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit' }}
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: 12,
              background: '#0077ff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Scheduling...' : 'Schedule Maintenance'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/manager-calendar')}
            style={{
              flex: 1,
              padding: 12,
              background: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
