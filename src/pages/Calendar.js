import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
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

const eventColors = {
  class: '#2563eb',
  meeting: '#059669',
  deadline: '#eab308',
};

const initialEvents = [
  {
    id: 1,
    title: '10A Mathematics',
    type: 'class',
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    desc: 'Chapter 5: Algebra',
  },
  {
    id: 2,
    title: 'Staff Meeting',
    type: 'meeting',
    start: new Date(new Date().setHours(12, 0, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
    desc: 'Monthly review',
  },
  {
    id: 3,
    title: 'Assignment Deadline',
    type: 'deadline',
    start: new Date(new Date().setHours(23, 59, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 0, 0)),
    desc: 'Submit science project',
  },
];

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

function CalendarPage() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
      return JSON.parse(saved).map(ev => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));
    }
    return initialEvents;
  });
  const [modal, setModal] = useState(null); // { event, mode: 'add'|'edit' }
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setModal({ mode: 'add', event: {
      title: '',
      type: 'class',
      start: slot.start,
      end: slot.end,
      desc: '',
    }});
  };
  const handleSelectEvent = (event) => {
    setModal({ mode: 'edit', event });
  };
  const handleCloseModal = () => {
    setModal(null);
    setSelectedSlot(null);
  };
  const handleSave = (eventData) => {
    if (modal.mode === 'add') {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    } else {
      setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev));
    }
    handleCloseModal();
  };
  const handleDelete = (eventId) => {
    setEvents(events.filter(ev => ev.id !== eventId));
    handleCloseModal();
  };
  // Drag-and-drop handlers
  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const updatedEvent = { ...event, start, end, allDay: droppedOnAllDaySlot };
    setEvents(events.map(ev => ev.id === event.id ? updatedEvent : ev));
  };
  const resizeEvent = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(events.map(ev => ev.id === event.id ? updatedEvent : ev));
  };
  return (
    <div className="calendar-page">
      <h2>Calendar & Scheduling</h2>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 8 }}>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={event => ({ style: { background: eventColors[event.type] || '#2563eb', color: '#fff', borderRadius: 6 } })}
          popup
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          resizable
        />
      </div>
      {modal && (
        <EventModal
          event={modal.event}
          mode={modal.mode}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function EventModal({ event, mode, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event.title || '');
  const [type, setType] = useState(event.type || 'class');
  const [desc, setDesc] = useState(event.desc || '');
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
      type,
      desc,
      start: parseDateTimeLocal(start),
      end: parseDateTimeLocal(end),
    });
  };
  return (
    <Modal title={mode === 'add' ? 'Add Event' : 'Edit Event'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ minWidth: 260, display: 'grid', gap: 12 }}>
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <select className="input" value={type} onChange={e => setType(e.target.value)}>
          <option value="class">Class</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
        </select>
        <input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        <textarea className="input" placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 60 }} />
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

export default CalendarPage; 