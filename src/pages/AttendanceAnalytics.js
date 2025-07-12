import React, { useState, useMemo } from 'react';
import Button from '../components/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initialClasses } from './Classes';
import { initialStudents } from './Students';

function AttendanceAnalytics() {
  // Real classes and students
  const classes = initialClasses.map(c => ({ id: c.id, name: `${c.subject} ${c.grade}${c.section}` }));
  const students = initialStudents;

  // Attendance records from localStorage
  const attendanceRecords = useMemo(() => {
    const saved = localStorage.getItem('attendanceRecords');
    if (!saved) return [];
    const records = JSON.parse(saved);
    // Flatten: [{classId, date, [studentId]: status} ...] => [{date, classId, studentId, status} ...]
    let arr = [];
    Object.entries(records).forEach(([key, value]) => {
      const [classId, date] = key.split('_');
      Object.entries(value).forEach(([studentId, status]) => {
        arr.push({
          date,
          classId: Number(classId),
          studentId: Number(studentId),
          status,
        });
      });
    });
    return arr;
  }, []);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filtered records
  const filtered = attendanceRecords.filter(r =>
    (!selectedClass || r.classId === Number(selectedClass)) &&
    (!selectedStudent || r.studentId === Number(selectedStudent)) &&
    (!dateFrom || r.date >= dateFrom) &&
    (!dateTo || r.date <= dateTo)
  );

  // Chart data: group by date, count present/absent/late
  const chartData = useMemo(() => {
    const dateMap = {};
    filtered.forEach(r => {
      if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, Present: 0, Absent: 0, Late: 0 };
      if (r.status === 'present') dateMap[r.date].Present++;
      else if (r.status === 'absent') dateMap[r.date].Absent++;
      else if (r.status === 'late') dateMap[r.date].Late++;
    });
    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // Student summary: for each student, count present/absent/late and calculate present %
  const studentSummary = useMemo(() => {
    // Get relevant students (filtered by class if set)
    const relevantStudents = students.filter(s => !selectedClass || attendanceRecords.some(r => r.classId === Number(selectedClass) && r.studentId === s.id));
    return relevantStudents.map(s => {
      const records = filtered.filter(r => r.studentId === s.id);
      const total = records.length;
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;
      const percent = total > 0 ? ((present / total) * 100).toFixed(1) : '—';
      return {
        id: s.id,
        name: s.name,
        present,
        absent,
        late,
        total,
        percent,
      };
    });
  }, [filtered, students, selectedClass, attendanceRecords]);

  // Export CSV (keep for now)
  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Class', 'Student', 'Status'],
      ...filtered.map(r => [
        r.date,
        classes.find(c => c.id === r.classId)?.name || '',
        students.find(s => s.id === r.studentId)?.name || '',
        r.status
      ])
    ];
    const csv = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="attendance-analytics-page" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Attendance Analytics</h2>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 16, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontWeight: 500 }}>Class</label><br />
          <select className="input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ minWidth: 140 }}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Student</label><br />
          <select className="input" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ minWidth: 140 }}>
            <option value="">All Students</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>From</label><br />
          <input className="input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ minWidth: 120 }} />
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>To</label><br />
          <input className="input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ minWidth: 120 }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button type="button" onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 16, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Student Attendance Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
          <thead style={{ background: '#f3f4f6' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Student</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Present</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Absent</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Late</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Total</th>
              <th style={{ textAlign: 'center', padding: 8 }}>% Present</th>
            </tr>
          </thead>
          <tbody>
            {studentSummary.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No students found</td></tr>
            ) : (
              studentSummary.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{s.name}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{s.present}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{s.absent}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{s.late}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{s.total}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{s.percent === '—' ? '—' : `${s.percent}%`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 16, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Present" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="Absent" stroke="#e53e3e" strokeWidth={2} />
            <Line type="monotone" dataKey="Late" stroke="#f59e42" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 0, background: 'rgba(255,255,255,0.08)' }}>
        <table className="attendance-analytics-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#f3f4f6', zIndex: 1 }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600 }}>Date</th>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600 }}>Class</th>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600 }}>Student</th>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No records found</td></tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>{r.date}</td>
                  <td style={{ padding: 12 }}>{classes.find(c => c.id === r.classId)?.name || ''}</td>
                  <td style={{ padding: 12 }}>{students.find(s => s.id === r.studentId)?.name || ''}</td>
                  <td style={{ color: r.status === 'present' ? '#22c55e' : r.status === 'absent' ? '#e53e3e' : '#f59e42', fontWeight: 600, padding: 12 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceAnalytics; 