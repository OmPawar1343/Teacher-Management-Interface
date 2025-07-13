import React, { useMemo, useState, useEffect } from 'react';
import { initialStudents } from './Students';
import { initialClasses } from './Classes';
import Modal from '../components/Modal';

// Simple teacher data for display (only name and subject needed)
const fakeTeachers = [
  { name: 'Amit Sharma', subject: 'Mathematics' },
  { name: 'Priya Singh', subject: 'English' },
  { name: 'Rahul Verma', subject: 'Physics' },
  { name: 'Sunita Rao', subject: 'History' },
  { name: 'Vikram Patel', subject: 'Chemistry' },
];

function Report() {
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Live state for students, classes, attendance, resources
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('attendanceRecords');
    if (!saved) return [];
    const records = JSON.parse(saved);
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
  });

  // Filter state for class and section (now as text inputs)
  // Listen for localStorage changes (even from other tabs)
  useEffect(() => {
    function handleStorage() {
      const savedStudents = localStorage.getItem('students');
      setStudents(savedStudents ? JSON.parse(savedStudents) : initialStudents);
      const savedClasses = localStorage.getItem('classes');
      setClasses(savedClasses ? JSON.parse(savedClasses) : initialClasses);
      const savedAttendance = localStorage.getItem('attendanceRecords');
      if (savedAttendance) {
        const records = JSON.parse(savedAttendance);
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
        setAttendanceRecords(arr);
      } else {
        setAttendanceRecords([]);
      }
    }
    window.addEventListener('storage', handleStorage);
    // Also poll for changes in the same tab
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Get students for teacher or admin
  // The user prop was removed, so we'll just use the classes state directly
  // to determine which classes are relevant for the teacher.
  // This part of the logic needs to be re-evaluated based on the new_code.
  // For now, we'll assume all classes are relevant for the teacher.
  // If a teacher's specific classes are needed, this logic needs to be re-introduced.
  // For now, we'll just filter by search and class/section filters.

  // Filter by class (subject+grade+section) text
  // Filter by section text
  // Build report data for each student
  const classSummaries = useMemo(() => {
    return classes.map(cls => {
      // Find teacher for this class (by subject)
      const teacher = fakeTeachers.find(t => t.subject === cls.subject);
      // Attendance records for this class (and date if filtered)
      let classRecords = attendanceRecords.filter(r => r.classId === cls.id);
      const total = classRecords.length;
      const present = classRecords.filter(r => r.status === 'present').length;
      const absent = classRecords.filter(r => r.status === 'absent').length;
      const late = classRecords.filter(r => r.status === 'late').length;
      return {
        classId: cls.id,
        subject: cls.subject,
        teacher: teacher ? teacher.name : '—',
        present,
        absent,
        late,
        total,
      };
    });
  }, [classes, attendanceRecords]);

  return (
    <div className="report-page" style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 className="section-title report-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <span role="img" aria-label="Report" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>📊</span>
        Student Report
      </h2>
      {/* Subject/Teacher Attendance Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        {classSummaries.map((c, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 12,
            boxShadow: '0 1px 4px #0001',
            padding: 20,
            minWidth: 220,
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '6px solid #2563eb',
            position: 'relative',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => setSelectedClassId(c.classId)}
          tabIndex={0}
          role="button"
          aria-label={`Show details for ${c.subject}`}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#fff' }}>{c.subject}</div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Teacher: {c.teacher}</div>
            <div style={{ fontSize: 15, marginBottom: 2, color: '#fff' }}><b>Present:</b> {c.present}</div>
            <div style={{ fontSize: 15, marginBottom: 2, color: '#fff' }}><b>Absent:</b> {c.absent}</div>
            <div style={{ fontSize: 15, color: '#fff' }}><b>Late:</b> {c.late}</div>
            {/* dateFilter && <div style={{ fontSize: 13, color: '#fff', marginTop: 6 }}>Date: {dateFilter}</div> */}
          </div>
        ))}
      </div>
      {/* Modal for class details */}
      {selectedClassId && (
        <Modal title="Class Attendance Details" onClose={() => setSelectedClassId(null)}>
          <ClassAttendanceModalContent
            classId={selectedClassId}
            students={students}
            classes={classes}
            attendanceRecords={attendanceRecords}
          />
        </Modal>
      )}
      {/* Remove the search and date filter inputs below the table */}
      {/* <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <input ... />
        <div ...><input ... /></div>
      </div> */}
    </div>
  );
}

export default Report;

function ClassAttendanceModalContent({ classId, students, classes, attendanceRecords }) {
  const [date, setDate] = useState('');
  const cls = classes.find(c => c.id === classId);
  const filteredStudents = students.filter(s => (cls ? cls.studentIds || [] : []).includes(s.id));

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <input
          className="input"
          type="date"
          style={{ maxWidth: 150 }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div style={{ 
        overflowX: 'auto', 
        overflowY: 'auto', 
        maxHeight: 400, 
        minWidth: 300,
        maxWidth: '100vw',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table className="attendance-details-table" style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginBottom: 8, 
          background: '#3a4664', 
          borderRadius: 12, 
          overflow: 'hidden', 
          minWidth: 600,
          fontSize: '14px'
        }}>
          <thead style={{ background: '#394362' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Class</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Section</th>
              {date ? (
                <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Status ({date})</th>
              ) : (
                <>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Present</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Absent</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Late</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>% Present</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={date ? 4 : 7} style={{ textAlign: 'center', color: '#fff', padding: '12px 8px', fontSize: '13px' }}>No students found</td></tr>
            ) : (
              filteredStudents.map(s => {
                const present = attendanceRecords.filter(r => r.classId === classId && r.studentId === s.id && r.status === 'present').length;
                const absent = attendanceRecords.filter(r => r.classId === classId && r.studentId === s.id && r.status === 'absent').length;
                const late = attendanceRecords.filter(r => r.classId === classId && r.studentId === s.id && r.status === 'late').length;
                const percent = attendanceRecords.filter(r => r.classId === classId && r.studentId === s.id).length > 0 ? ((present / attendanceRecords.filter(r => r.classId === classId && r.studentId === s.id).length) * 100).toFixed(1) : '—';
                const status = date ? attendanceRecords.find(r => r.classId === classId && r.studentId === s.id && r.date === date)?.status : null;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: '#3a4664' }}>
                    <td style={{ padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{cls ? cls.grade : ''}</td>
                    <td style={{ padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{cls ? cls.section : ''}</td>
                    {date ? (
                      <td style={{ textAlign: 'center', padding: '8px 12px' }}>
                        {status ? (
                          <span style={{
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor:
                              status === 'present' ? '#dcfce7' :
                              status === 'absent' ? '#fee2e2' :
                              status === 'late' ? '#fef3c7' : '#eee',
                            color:
                              status === 'present' ? '#166534' :
                              status === 'absent' ? '#92400e' :
                              status === 'late' ? '#92400e' : '#888',
                            whiteSpace: 'nowrap'
                          }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        ) : (
                          <span style={{ 
                            color: '#ffa500', 
                            fontStyle: 'italic',
                            fontSize: '11px',
                            whiteSpace: 'nowrap'
                          }}>
                            No data
                          </span>
                        )}
                      </td>
                    ) : (
                      <>
                        <td style={{ textAlign: 'center', padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{present}</td>
                        <td style={{ textAlign: 'center', padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{absent}</td>
                        <td style={{ textAlign: 'center', padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{late}</td>
                        <td style={{ textAlign: 'center', padding: '8px 12px', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>{percent === '—' ? '—' : `${percent}%`}</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 