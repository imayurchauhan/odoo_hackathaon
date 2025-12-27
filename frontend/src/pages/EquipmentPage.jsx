import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/equipment.css';

export default function EquipmentPage(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', code:'', description:'', location:'', team: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/equipment');
      setItems(res.data);
    } catch(e) { console.error(e); }
  };

  useEffect(()=>{ load(); }, []);

  const save = async () => {
    if (!form.name || !form.code) {
      alert('Please fill in Name and Code');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/equipment/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post('/equipment', form);
      }
      setForm({ name:'', code:'', description:'', location:'', team: '' });
      setShowForm(false);
      load();
    } catch(e) { console.error(e); }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this equipment?')) {
      try {
        await api.delete(`/equipment/${id}`);
        load();
      } catch(e) { console.error(e); }
    }
  };

  const handleCancel = () => {
    setForm({ name:'', code:'', description:'', location:'', team: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="equipment-page">
      <div className="equipment-header">
        <div className="header-content">
          <h1>Equipment Management</h1>
          <p className="page-subtitle">Manage and track all maintenance equipment</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          + Add Equipment
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <h2>{editingId ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            <button className="close-btn" onClick={handleCancel}>✕</button>
          </div>
          <form className="equipment-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="form-row">
              <div className="form-group">
                <label>Equipment Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Pump Motor A"
                  value={form.name}
                  onChange={e=>setForm({...form,name:e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Equipment Code *</label>
                <input
                  type="text"
                  placeholder="e.g., PM-001"
                  value={form.code}
                  onChange={e=>setForm({...form,code:e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Building A, Floor 2"
                  value={form.location}
                  onChange={e=>setForm({...form,location:e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Team</label>
                <input
                  type="text"
                  placeholder="Assigned team"
                  value={form.team}
                  onChange={e=>setForm({...form,team:e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Add equipment details, specifications, or notes..."
                value={form.description}
                onChange={e=>setForm({...form,description:e.target.value})}
                className="form-input form-textarea"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Equipment' : 'Add Equipment'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="equipment-search">
        <input
          type="text"
          placeholder="Search by equipment name or code..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-count">{filteredItems.length} items</span>
      </div>

      {filteredItems.length > 0 ? (
        <div className="equipment-table-container">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Team</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} className={item.isScrapped ? 'scrapped' : ''}>
                  <td>
                    <div className="equipment-name">
                      <span className="equipment-icon">⚙️</span>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td><code className="code-badge">{item.code}</code></td>
                  <td>{item.location || '—'}</td>
                  <td>
                    {item.team?.name ? (
                      <span className="team-badge">{item.team.name}</span>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${item.isScrapped ? 'scrapped' : 'active'}`}>
                      {item.isScrapped ? 'SCRAPPED' : 'Active'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No equipment found</h3>
          <p>Add your first equipment to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Equipment
          </button>
        </div>
      )}

      <div className="equipment-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">Total Equipment</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{items.filter(i => !i.isScrapped).length}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⛔</div>
          <div className="stat-content">
            <div className="stat-value">{items.filter(i => i.isScrapped).length}</div>
            <div className="stat-label">Scrapped</div>
          </div>
        </div>
      </div>
    </div>
  );
}
