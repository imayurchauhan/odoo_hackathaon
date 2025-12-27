import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Avatar from '../components/Avatar';
import DurationModal from '../components/DurationModal';
import '../styles/kanban.css';

const STATUS_ORDER = ['new', 'in_progress', 'repaired'];

const STATUS_CONFIG = {
  new: { label: 'New', icon: '📋', color: 'blue' },
  in_progress: { label: 'In Progress', icon: '⚙️', color: 'orange' },
  repaired: { label: 'Repaired', icon: '✅', color: 'green' }
};

export default function KanbanBoard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [durationModalOpen, setDurationModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/maintenance');
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const grouped = STATUS_ORDER.map(s => ({ status: s, items: items.filter(i => i.status === s) }));

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId } = result;
    const destStatus = result.destination.droppableId;

    const card = items.find(i => i._id === draggableId);
    if (!card) return;

    // Only technicians (or admins) can drag
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser || (currentUser.role !== 'technician' && currentUser.role !== 'admin')) {
      alert('Only technicians can update task status');
      return;
    }

    // Ensure technician is part of the team
    if (currentUser.role === 'technician' && String(currentUser.team) !== String(card.team?._id)) {
      alert('You can only act on requests for your team');
      return;
    }

    // If moving to in_progress and card is unassigned, call pick
    if (destStatus === 'in_progress' && !card.assignedTo) {
      try {
        await api.post(`/maintenance/${draggableId}/pick`);
        load();
        return;
      } catch (e) {
        console.error(e);
        alert(e.response?.data?.message || 'Unable to pick request');
        return;
      }
    }

    // If moving to repaired, require duration input (open modal)
    if (destStatus === 'repaired') {
      setPendingCardId(draggableId);
      setDurationModalOpen(true);
      return;
    }

    // For other moves (e.g., to new) simply update status
    try {
      await api.put(`/maintenance/${draggableId}`, { status: destStatus });
      load();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Error updating request');
    }
  };

  const pickRequest = async (id) => {
    try {
      await api.post(`/maintenance/${id}/pick`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Unable to pick request');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = { low: 'green', medium: 'orange', high: 'red' };
    return colors[priority] || 'gray';
  };

  const getTypeLabel = (type) => {
    return type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective';
  };

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <div className="header-content">
          <h1>Maintenance Workflow</h1>
          <p className="page-subtitle">Drag and drop cards to update request status</p>
        </div>
        <div className="kanban-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{items.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Active</span>
            <span className="stat-value">{items.filter(i => !['repaired', 'scrap'].includes(i.status)).length}</span>
          </div>
        </div>
      </div>

      {loading && <div className="loading-indicator">Loading tasks...</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {grouped.map(g => (
            <Droppable droppableId={g.status} key={g.status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column status-${g.status} ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  <div className="column-header">
                    <span className="column-icon">{STATUS_CONFIG[g.status].icon}</span>
                    <div className="column-title-section">
                      <h2 className="column-title">{STATUS_CONFIG[g.status].label}</h2>
                      <span className="column-count">{g.items.length}</span>
                    </div>
                  </div>

                  <div className="cards-container">
                    {g.items.length === 0 ? (
                      <div className="empty-column">
                        <div className="empty-icon">😌</div>
                        <p>No tasks here</p>
                      </div>
                    ) : (
                      g.items.map((it, index) => {
                        const isOverdue = it.dueAt && new Date(it.dueAt) < new Date() && !['repaired', 'scrap'].includes(it.status);
                        return (
                          <Draggable key={it._id} draggableId={it._id} index={index}>
                            {(prov, snapshot) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''} ${isOverdue ? 'overdue' : ''}`}
                              >
                                <div className="card-top">
                                  <div className="card-badges">
                                    <span className={`badge type-badge`}>
                                      {getTypeLabel(it.type)}
                                    </span>
                                    <span className={`badge priority-badge priority-${getPriorityColor(it.priority)}`}>
                                      {it.priority.charAt(0).toUpperCase() + it.priority.slice(1)}
                                    </span>
                                  </div>
                                  {isOverdue && <span className="overdue-badge">⚠️ Overdue</span>}
                                </div>

                                <div className="card-title">{it.title}</div>

                                <div className="card-equipment">
                                  <span className="equipment-icon">⚙️</span>
                                  <span className="equipment-name">{it.equipment?.name || 'Unknown'}</span>
                                </div>

                                {it.dueAt && (
                                  <div className="card-date">
                                    <span className="date-icon">📅</span>
                                    <span>{new Date(it.dueAt).toLocaleDateString()}</span>
                                  </div>
                                )}

                                <div className="card-footer">
                                  <div className="assignee">
                                    {it.assignedTo ? (
                                      <>
                                        <Avatar user={it.assignedTo} size={32} />
                                        <span className="assignee-name">{it.assignedTo.name}</span>
                                      </>
                                    ) : (
                                      <button 
                                        className="btn-pick" 
                                        onClick={() => pickRequest(it._id)}
                                        title="Assign to yourself"
                                      >
                                        👤 Pick
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <DurationModal
        open={durationModalOpen}
        title="Enter duration in hours (e.g. 2.5)"
        onCancel={() => { setDurationModalOpen(false); setPendingCardId(null); }}
        onConfirm={async (val) => {
          setDurationModalOpen(false);
          const id = pendingCardId;
          setPendingCardId(null);
          if (!id) return;
          try {
            await api.put(`/maintenance/${id}`, { status: 'repaired', duration: Number(val) });
            load();
          } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || 'Error marking repaired');
          }
        }}
      />
    </div>
  );
}
