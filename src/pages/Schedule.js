import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../components/Modal';
import Button from '../components/Button';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// School day timetable (periods/lectures)
const timetable = [
  { time: '09:00 - 09:45', label: 'First Lecture', subject: 'Mathematics', teacher: 'Rohit Sharma' },
  { time: '09:45 - 10:30', label: 'Second Lecture', subject: 'English', teacher: 'Priya Singh' },
  { time: '10:30 - 11:00', label: 'Recess', subject: '', teacher: '' },
  { time: '11:00 - 11:45', label: 'Third Lecture', subject: 'Physics', teacher: 'Rahul Verma' },
  { time: '11:45 - 12:30', label: 'Fourth Lecture', subject: 'History', teacher: 'Sunita Rao' },
  { time: '12:30 - 13:15', label: 'Fifth Lecture', subject: 'Chemistry', teacher: 'Vikram Patel' },
];

// Festival holidays (example dates for 2025)
const festivalHolidays = [
  { title: 'Diwali', start: new Date('2025-10-20'), end: new Date('2025-10-20'), allDay: true },
  { title: 'Christmas', start: new Date('2025-12-25'), end: new Date('2025-12-25'), allDay: true },
  { title: 'Eid', start: new Date('2025-03-31'), end: new Date('2025-03-31'), allDay: true },
  { title: 'Holi', start: new Date('2025-03-25'), end: new Date('2025-03-25'), allDay: true },
];

// Function to generate all weekends (Saturday, Sunday) for the current year
function getWeekendHolidays(year) {
  const weekends = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      weekends.push({
        title: 'Holiday',
        start: new Date(d),
        end: new Date(d),
        allDay: true,
        isWeekend: true,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return weekends;
}

function Schedule() {
  const year = 2025;
  // --- Event CRUD State ---
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('schoolCalendarEvents');
    if (saved) {
      return JSON.parse(saved).map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));
    }
    return [
      ...festivalHolidays,
      ...getWeekendHolidays(year),
    ];
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [festivalModalOpen, setFestivalModalOpen] = useState(false);
  const [modal, setModal] = useState(null); // { event, mode: 'add'|'edit' }
  // Removed unused selectedSlot

  useEffect(() => {
    localStorage.setItem('schoolCalendarEvents', JSON.stringify(events));
  }, [events]);

  // Add event
  const handleSelectSlot = (slot) => {
    setModal({ mode: 'add', event: {
      title: '',
      start: slot.start,
      end: slot.end,
      allDay: true,
    }});
  };
  // Edit event
  const handleSelectEvent = (event) => {
    setModal({ mode: 'edit', event });
  };
  // Save (add or update)
  const handleSave = (eventData) => {
    if (modal.mode === 'add') {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    } else {
      setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev));
    }
    setModal(null);
  };
  // Delete
  const handleDelete = (eventId) => {
    setEvents(events.filter(ev => ev.id !== eventId));
    setModal(null);
  };
  return (
    <div className="schedule-page" style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h2 className="section-title schedule-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <span role="img" aria-label="Schedule" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>🗓️</span>
        Timetable
      </h2>
      {/* Timetable Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        {timetable.map((row, i) => (
          <div key={i} className="timetable-card" style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 12,
            boxShadow: '0 1px 4px #0001',
            padding: 20,
            minWidth: 220,
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: row.label === 'Recess' ? '6px solid #fbbf24' : '6px solid #2563eb',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#fff' }}>{row.label}</div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>{row.time}</div>
            {row.label === 'Recess' ? (
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Recess</div>
            ) : (
              <>
                <div style={{ fontSize: 15, marginBottom: 2, color: '#fff' }}><b>Subject:</b> {row.subject}</div>
                <div style={{ fontSize: 15, color: '#fff' }}><b>Teacher:</b> {row.teacher}</div>
              </>
            )}
          </div>
        ))}
        {/* Calendar Card */}
        <div
          className="calendar-card"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 12,
            boxShadow: '0 1px 4px #0001',
            padding: 20,
            minWidth: 220,
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderLeft: '6px solid #fbbf24',
            position: 'relative',
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => setCalendarOpen(true)}
        >
          <span style={{ fontSize: 32, marginBottom: 8 }}>📅</span>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#fff' }}>School Calendar</div>
          <div style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>Tap to view holidays</div>
        </div>
      </div>
      {/* Calendar Modal */}
      {calendarOpen && (
        <Modal title="School Calendar" onClose={() => setCalendarOpen(false)}>
          <div style={{ width: 600, maxWidth: '90vw' }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 450 }}
              views={['month']}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={event => {
                if (event.isWeekend) {
                  return { style: { background: '#fee2e2', color: '#b91c1c', borderRadius: 6 } };
                }
                if (festivalHolidays.some(f => f.title === event.title)) {
                  return { style: { background: '#fbbf24', color: '#92400e', borderRadius: 6 } };
                }
                return { style: { background: '#2563eb', color: '#fff', borderRadius: 6 } };
              }}
              popup
            />
            <div style={{ marginTop: 16, color: '#fff', fontWeight: 500 }}>
              <span
                style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 10px', borderRadius: 6, cursor: 'pointer', textDecoration: 'underline', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                onClick={() => setFestivalModalOpen(true)}
                tabIndex={0}
                role="button"
                aria-label="Show festival holidays"
              >
                Festival Holiday
              </span>
            </div>
          </div>
        </Modal>
      )}
      {/* Event Add/Edit Modal */}
      {modal && (
        <EventModal
          event={modal.event}
          mode={modal.mode}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setModal(null); }}
        />
      )}
      {/* Festival Holidays Modal */}
      {festivalModalOpen && (
        <Modal title="Festival Holidays (2025)" onClose={() => setFestivalModalOpen(false)}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, minWidth: 260 }}>
            {festivalHolidays.map(f => (
              <li key={f.title} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 16 }}>
                <b>{f.title}</b>: {f.start.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}

export default Schedule;

// Add EventModal component at the end of the file
function EventModal({ event, mode, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event.title || '');
  const [start, setStart] = useState(event.start ? formatDateTimeLocal(event.start) : '');
  const [end, setEnd] = useState(event.end ? formatDateTimeLocal(event.end) : '');
  const [error, setError] = useState('');

  function formatDateTimeLocal(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
  function parseDateTimeLocal(str) {
    return new Date(str);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !start || !end) {
      setError('Title, start, and end are required.');
      return;
    }
    onSave({
      ...event,
      title,
      start: parseDateTimeLocal(start),
      end: parseDateTimeLocal(end),
    });
  };
  return (
    <Modal title={mode === 'add' ? 'Add Event' : 'Edit Event'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ minWidth: 260, display: 'grid', gap: 12 }}>
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button type="submit">{mode === 'add' ? 'Add' : 'Save'}</Button>
          {mode === 'edit' && <Button type="button" style={{ background: '#e53e3e' }} onClick={() => onDelete(event.id)}>Delete</Button>}
          <Button type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
} 