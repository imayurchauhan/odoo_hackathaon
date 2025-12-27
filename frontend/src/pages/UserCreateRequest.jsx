import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UserCreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    equipment: '',
    type: 'corrective',
    description: '',
    priority: 'medium'
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
      setError('Request subject is required');
      return;
    }
    if (!selected) {
      setError('Please select equipment');
      return;
    }

    try {
      const payload = { ...form, equipment: selected._id };
      await api.post('/maintenance', payload);
      navigate('/my-requests');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Error creating request');
    }
  };

  const handleEquipmentChange = (e) => {
    const equipmentId = e.target.value;
    setForm({ ...form, equipment: equipmentId });
    const selectedEquipment = equipment.find(x => x._id === equipmentId);
    setSelected(selectedEquipment);
  };

  const typeOptions = [
    { value: 'preventive', label: '🛡️ Preventive', desc: 'Regular maintenance' },
    { value: 'corrective', label: '🔧 Corrective', desc: 'Fix broken equipment' }
  ];

  const priorityOptions = [
    { value: 'low', label: '🟢 Low', color: '#22c55e' },
    { value: 'medium', label: '🟡 Medium', color: '#f59e0b' },
    { value: 'high', label: '🔴 High', color: '#ef4444' }
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Create Maintenance Request</h1>
        <p style={{ color: '#666', margin: 0 }}>Submit a new maintenance request for equipment repair or service</p>
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
            placeholder="e.g., Pump motor making strange noise"
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

        {/* Auto-filled: Equipment Category */}
        {selected && (
          <div style={{ marginBottom: 20, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Equipment Category</label>
            <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>{selected.code || 'N/A'}</p>
          </div>
        )}

        {/* Auto-filled: Assigned Team */}
        {selected && selected.team && (
          <div style={{ marginBottom: 20, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Assigned Maintenance Team</label>
            <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>{selected.team.name || 'N/A'}</p>
          </div>
        )}

        {/* Request Type */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Request Type</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {typeOptions.map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                <input
                  type="radio"
                  name="type"
                  value={opt.value}
                  checked={form.type === opt.value}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Priority</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {priorityOptions.map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                <input
                  type="radio"
                  name="priority"
                  value={opt.value}
                  checked={form.priority === opt.value}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Description</label>
          <textarea
            placeholder="Describe the issue and expected maintenance..."
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
            {loading ? 'Creating...' : 'Create Request'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-requests')}
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
