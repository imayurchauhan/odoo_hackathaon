import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ManagerCalendar() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/maintenance?type=preventive');
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const getRequestsForDate = (day) => {
    return requests.filter(req => {
      if (!req.scheduledAt) return false;
      const reqDate = new Date(req.scheduledAt);
      return reqDate.getDate() === day &&
        reqDate.getMonth() === currentDate.getMonth() &&
        reqDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: 8 }}>Maintenance Calendar</h1>
            <p style={{ color: '#666', margin: 0 }}>View and manage preventive maintenance schedule</p>
          </div>
          <button
            onClick={() => navigate('/manager-create-preventive')}
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
            + Schedule Maintenance
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Month Navigator */}
        <div style={{ padding: 24, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={prevMonth}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#0077ff' }}
          >
            ◀
          </button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{monthName}</h2>
          <button
            onClick={nextMonth}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#0077ff' }}
          >
            ▶
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: 24 }}>
          {/* Weekday Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginBottom: 12 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 600, color: '#666', fontSize: 13, padding: 8 }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {days.map((day, idx) => {
              const dayRequests = day ? getRequestsForDate(day) : [];
              return (
                <div
                  key={idx}
                  style={{
                    minHeight: 120,
                    padding: 8,
                    background: day ? '#f9f9f9' : '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 6,
                    cursor: day && dayRequests.length > 0 ? 'pointer' : 'default'
                  }}
                >
                  {day && (
                    <>
                      <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>{day}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {dayRequests.map(req => (
                          <div
                            key={req._id}
                            onClick={() => navigate(`/request/${req._id}`)}
                            style={{
                              background: '#e3f2fd',
                              color: '#0077ff',
                              padding: '4px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={req.title}
                          >
                            🛡️ {req.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Requests List */}
        {requests.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600 }}>Upcoming Scheduled Maintenance</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {requests
                .filter(r => r.scheduledAt && new Date(r.scheduledAt) >= currentDate)
                .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
                .slice(0, 10)
                .map(req => (
                  <div
                    key={req._id}
                    onClick={() => navigate(`/request/${req._id}`)}
                    style={{
                      padding: 12,
                      background: '#f5f5f5',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{req.title}</p>
                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 13 }}>{req.equipment?.name}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: '#666' }}>
                      {new Date(req.scheduledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
