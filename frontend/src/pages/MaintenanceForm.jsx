import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/form.css';

export default function MaintenanceForm(){
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    title: '',
    equipment: '',
    type: 'preventive',
    description: '',
    scheduledAt: '',
    priority: 'medium'
  });
  const [equipment, setEquipment] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    setLoading(true);
    api.get('/equipment')
      .then(r => setEquipment(r.data))
      .catch(e => {
        console.error(e);
        setError('Failed to load equipment');
      })
      .finally(() => setLoading(false));

    if(params.get('scheduledAt')) {
      setForm(f => ({...f, scheduledAt: params.get('scheduledAt')}));
    }
  }, [params]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Request title is required');
      return;
    }
    if (!selected) {
      setError('Please select equipment');
      return;
    }

    try {
      const payload = {...form, equipment: selected._id};
      await api.post('/maintenance', payload);
      navigate('/kanban');
    } catch(e) {
      console.error(e);
      setError(e.response?.data?.message || 'Error creating request');
    }
  };

  const handleEquipmentChange = (e) => {
    const equipmentId = e.target.value;
    setForm({...form, equipment: equipmentId});
    const selectedEquipment = equipment.find(x => x._id === equipmentId);
    setSelected(selectedEquipment);
  };

  const typeOptions = [
    { value: 'preventive', label: 'Preventive', icon: '🛡️', color: 'blue' },
    { value: 'corrective', label: 'Corrective', icon: '🔧', color: 'orange' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'high', label: 'High', icon: '🔴' }
  ];

  return (
    <div className="form-page">
      <div className="form-header">
        <div className="header-content">
          <h1>Create Maintenance Request</h1>
          <p className="page-subtitle">Schedule a new maintenance task for your equipment</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <form className="maintenance-form" onSubmit={submit}>
        <div className="form-card">
          <div className="section-title">
            <span className="section-icon">📋</span>
            <h2>Request Details</h2>
          </div>

          <div className="form-group">
            <label htmlFor="title">Request Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Routine quarterly inspection"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="form-input"
              required
            />
            <span className="input-hint">Briefly describe the maintenance task</span>
          </div>

          <div className="form-divider"></div>

          <div className="section-title">
            <span className="section-icon">⚙️</span>
            <h2>Equipment Selection</h2>
          </div>

          {loading ? (
            <div className="loading-state">Loading equipment...</div>
          ) : equipment.length === 0 ? (
            <div className="empty-section">
              <div className="empty-icon">📦</div>
              <p>No equipment available. <a href="/equipment">Add equipment first</a>.</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="equipment">Select Equipment *</label>
                <select
                  id="equipment"
                  value={form.equipment}
                  onChange={handleEquipmentChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose equipment...</option>
                  {equipment.map(eq => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} ({eq.code}) — {eq.location || 'No location'}
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <div className="equipment-preview">
                  <div className="preview-header">
                    <span className="preview-icon">✓</span>
                    <span>Selected Equipment</span>
                  </div>
                  <div className="preview-content">
                    <div className="preview-row">
                      <span className="preview-label">Name:</span>
                      <span className="preview-value">{selected.name}</span>
                    </div>
                    <div className="preview-row">
                      <span className="preview-label">Code:</span>
                      <span className="preview-code">{selected.code}</span>
                    </div>
                    <div className="preview-row">
                      <span className="preview-label">Location:</span>
                      <span className="preview-value">{selected.location || '—'}</span>
                    </div>
                    {selected.team && (
                      <div className="preview-row">
                        <span className="preview-label">Team:</span>
                        <span className="preview-team">{selected.team.name}</span>
                      </div>
                    )}
                    {selected.lastMaintenanceAt && (
                      <div className="preview-row">
                        <span className="preview-label">Last Maintenance:</span>
                        <span className="preview-value">
                          {new Date(selected.lastMaintenanceAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-divider"></div>

          <div className="section-title">
            <span className="section-icon">🎯</span>
            <h2>Request Configuration</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Maintenance Type *</label>
              <div className="radio-group">
                {typeOptions.map(option => (
                  <label key={option.value} className={`radio-option type-${option.color}`}>
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={form.type === option.value}
                      onChange={e => setForm({...form, type: e.target.value})}
                    />
                    <span className="radio-icon">{option.icon}</span>
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Priority Level *</label>
              <div className="radio-group">
                {priorityOptions.map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={form.priority === option.value}
                      onChange={e => setForm({...form, priority: e.target.value})}
                    />
                    <span className="radio-icon">{option.icon}</span>
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-group">
            <label htmlFor="scheduledAt">Scheduled Date</label>
            <input
              id="scheduledAt"
              type="date"
              value={form.scheduledAt}
              onChange={e => setForm({...form, scheduledAt: e.target.value})}
              className="form-input"
            />
            <span className="input-hint">Leave empty for immediate scheduling</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description & Notes</label>
            <textarea
              id="description"
              placeholder="Add any additional details, observations, or special instructions for the maintenance technician..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="form-input form-textarea"
              rows="4"
            />
            <span className="input-hint">{form.description.length} / 500 characters</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            Create Request
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
