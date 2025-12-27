import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/calendar.css';

export default function CalendarView(){
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11)); // Dec 2024
  const navigate = useNavigate();

  useEffect(()=>{ loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/maintenance?type=preventive');
      setEvents(res.data);
    } catch(e) { console.error(e); }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      const eventDate = new Date(e.scheduledAt || e.createdAt).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isoDate = date.toISOString();
    navigate(`/requests/new?scheduledAt=${encodeURIComponent(isoDate)}`);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header-section">
        <div className="calendar-title-group">
          <h1>Maintenance Calendar</h1>
          <p className="calendar-subtitle">View and schedule preventive maintenance</p>
        </div>
        <div className="calendar-controls">
          <button className="cal-btn cal-btn-secondary" onClick={handleToday}>Today</button>
          <button className="cal-btn cal-btn-icon" onClick={handlePrevMonth}>←</button>
          <button className="cal-btn cal-btn-icon" onClick={handleNextMonth}>→</button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-month-header">
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        </div>

        <div className="calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-names">
            {dayNames.map((day, i) => (
              <div key={i} className="calendar-day-name">{day}</div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="calendar-days">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day && 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={idx}
                  className={`calendar-day ${day ? 'active' : 'empty'} ${isToday ? 'today' : ''}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="day-events">
                        {dayEvents.slice(0, 2).map((evt, i) => (
                          <div key={i} className="event-dot preventive" title={evt.title}>
                            {evt.title.substring(0, 15)}...
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="event-more">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="calendar-footer">
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color preventive"></span>
            <span>Preventive Maintenance ({events.length})</span>
          </div>
        </div>
        <p className="calendar-hint">Click on any day to create a new maintenance request</p>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="calendar-sidebar">
        <h3>Upcoming Maintenance</h3>
        <div className="upcoming-list">
          {events.slice(0, 5).map((evt, i) => {
            const date = new Date(evt.scheduledAt || evt.createdAt);
            return (
              <div key={i} className="upcoming-item">
                <div className="upcoming-date">{date.toLocaleDateString()}</div>
                <div className="upcoming-title">{evt.title}</div>
                <div className="upcoming-priority">
                  <span className={`badge badge-${evt.priority || 'medium'}`}>{evt.priority || 'Normal'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
