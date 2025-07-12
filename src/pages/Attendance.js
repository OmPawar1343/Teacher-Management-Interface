import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { initialClasses } from './Classes';
import { initialStudents } from './Students';

const today = new Date().toISOString().slice(0, 10);

function Attendance() {
  // Use live classes from localStorage or initialClasses
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [date, setDate] = useState(today);
  // Attendance records: { [classId_date]: { [studentId]: status } }
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : {};
  });

  // Students for selected class
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Filter students for the selected class
  const classObj = classes.find(c => c.id === selectedClass);
  const studentsInClass = classObj ? students.filter(s => (classObj.studentIds || []).includes(s.id)) : [];

  // Current status for this class/date
  const key = `${selectedClass}_${date}`;
  const status = records[key] || studentsInClass.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {});

  // Save to localStorage on records change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  // Update classes if localStorage changes
  useEffect(() => {
    function handleStorage() {
      const saved = localStorage.getItem('classes');
      setClasses(saved ? JSON.parse(saved) : initialClasses);
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Set all statuses
  const setAll = (val) => {
    setRecords(r => ({ ...r, [key]: studentsInClass.reduce((acc, s) => ({ ...acc, [s.id]: val }), {}) }));
  };

  // Set individual status
  const setStatus = (id, val) => {
    setRecords(r => ({ ...r, [key]: { ...status, [id]: val } }));
  };

  return (
    <div className="attendance-page">
      <h2 className="section-title attendance-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <span role="img" aria-label="Attendance" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>📝</span>
        Attendance
      </h2>
      <div className="attendance-controls" style={{ borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 16, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.08)' }}>
        <div>
          <label className="attendance-label">Class</label><br />
          <select className="input" value={selectedClass} onChange={e => setSelectedClass(Number(e.target.value))} style={{ minWidth: 140 }}>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.subject} {c.grade}{c.section}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="attendance-label">Date</label><br />
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ minWidth: 140 }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button type="button" onClick={() => setAll('present')} style={{ background: '#22c55e' }}>All Present</Button>
          <Button type="button" onClick={() => setAll('absent')} style={{ background: '#e53e3e' }}>All Absent</Button>
          <Button type="button" onClick={() => setAll('late')} style={{ background: '#f59e42' }}>All Late</Button>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 0 }}>
        <table className="attendance-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className="attendance-th">Student</th>
              <th className="attendance-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentsInClass.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{s.name}</td>
                <td style={{ padding: 12 }}>
                  <select
                    className={`input status-select status-${status[s.id]}`}
                    value={status[s.id]}
                    onChange={e => setStatus(s.id, e.target.value)}
                    style={{ minWidth: 100 }}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance; 