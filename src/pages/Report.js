import React, { useMemo, useState, useEffect } from 'react';
import { initialStudents } from './Students';
import { initialClasses } from './Classes';
import Modal from '../components/Modal';

// Fake teacher data for report
const fakeTeachers = [
  {
    id: 1,
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    subject: 'Mathematics',
    totalClasses: 18,
    attendanceRate: 92.5,
    feedback: 4.3,
    assignments: 5,
    reports: 2,
    lastActive: '2024-06-10',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    subject: 'English',
    totalClasses: 15,
    attendanceRate: 88.1,
    feedback: 4.6,
    assignments: 4,
    reports: 1,
    lastActive: '2024-06-09',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    subject: 'Physics',
    totalClasses: 12,
    attendanceRate: 85.7,
    feedback: 4.1,
    assignments: 3,
    reports: 2,
    lastActive: '2024-06-08',
    status: 'On Leave',
  },
  {
    id: 4,
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    subject: 'History',
    totalClasses: 10,
    attendanceRate: 90.2,
    feedback: 4.8,
    assignments: 2,
    reports: 1,
    lastActive: '2024-06-07',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Vikram Patel',
    email: 'vikram.patel@example.com',
    subject: 'Chemistry',
    totalClasses: 8,
    attendanceRate: 80.0,
    feedback: 3.9,
    assignments: 1,
    reports: 0,
    lastActive: '2024-06-05',
    status: 'Inactive',
  },
];

function Report() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // New date filter state
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
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('resources');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter state for class and section (now as text inputs)
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

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
      const savedResources = localStorage.getItem('resources');
      setResources(savedResources ? JSON.parse(savedResources) : []);
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
  let relevantStudents = students;
  let teacherClasses = [];
  // The user prop was removed, so we'll just use the classes state directly
  // to determine which classes are relevant for the teacher.
  // This part of the logic needs to be re-evaluated based on the new_code.
  // For now, we'll assume all classes are relevant for the teacher.
  // If a teacher's specific classes are needed, this logic needs to be re-introduced.
  // For now, we'll just filter by search and class/section filters.

  // Filter by search
  relevantStudents = relevantStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  // Filter by class (subject+grade+section) text
  if (classFilter.trim()) {
    relevantStudents = relevantStudents.filter(s => {
      const studentClass = classes.find(cls => (cls.studentIds || []).includes(s.id));
      if (!studentClass) return false;
      const label = `${studentClass.subject} ${studentClass.grade}${studentClass.section}`.toLowerCase();
      return label.includes(classFilter.trim().toLowerCase());
    });
  }
  // Filter by section text
  if (sectionFilter.trim()) {
    relevantStudents = relevantStudents.filter(s => s.section && s.section.toLowerCase().includes(sectionFilter.trim().toLowerCase()));
  }

  // Build report data for each student
  const reportRows = relevantStudents.map(s => {
    // Find class for student
    const studentClass = classes.find(cls => (cls.studentIds || []).includes(s.id));
    
    // Attendance summary - filter by date if dateFilter is set
    let records = attendanceRecords.filter(r => r.studentId === s.id);
    if (dateFilter) {
      records = records.filter(r => r.date === dateFilter);
    }
    
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    
    // Calculate percentage only if there are records
    const percent = records.length > 0 ? ((present / records.length) * 100).toFixed(1) : '—';
    
    // Assignment submitted: check if any resource for this class has a submission for this student with status 'Submitted'
    let assignmentSubmitted = 'No';
    if (studentClass) {
      const classResources = resources.filter(r => Number(r.classId) === studentClass.id);
      for (const res of classResources) {
        if (res.submissions && res.submissions.some(sub => sub.studentId === s.id && sub.status === 'Submitted')) {
          assignmentSubmitted = 'Yes';
          break;
        }
      }
    }
    
    return {
      id: s.id,
      name: s.name,
      gender: s.gender,
      className: studentClass ? `${studentClass.subject} ${studentClass.grade}${studentClass.section}` : '',
      present,
      absent,
      late,
      percent,
      assignmentSubmitted,
      // Add specific date attendance status if date filter is applied
      dateStatus: dateFilter && records.length > 0 ? records[0].status : null,
    };
  });

  // --- Subject/Teacher Attendance Summary Cards ---
  // Build a summary for each class (subject/teacher)
  const classSummaries = useMemo(() => {
    return classes.map(cls => {
      // Find teacher for this class (by subject)
      const teacher = fakeTeachers.find(t => t.subject === cls.subject);
      // Attendance records for this class (and date if filtered)
      let classRecords = attendanceRecords.filter(r => r.classId === cls.id);
      if (dateFilter) classRecords = classRecords.filter(r => r.date === dateFilter);
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
  }, [classes, attendanceRecords, dateFilter]);

  // Helper: get students for a class
  function getStudentsForClass(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return [];
    // Assume studentIds is an array of student IDs in the class
    return students.filter(s => (cls.studentIds || []).includes(s.id));
  }
  // Helper: get attendance summary for a student in a class
  function getStudentAttendanceSummary(student, classId) {
    let records = attendanceRecords.filter(r => r.classId === classId && r.studentId === student.id);
    if (dateFilter) records = records.filter(r => r.date === dateFilter);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const percent = records.length > 0 ? ((present / records.length) * 100).toFixed(1) : '—';
    return { present, absent, late, percent };
  }

  // Unique class and section options for filters
  const classOptions = classes.map(cls => ({
    id: cls.id,
    label: `${cls.subject} ${cls.grade}${cls.section}`
  }));
  const sectionOptions = Array.from(new Set(classes.map(cls => cls.section)));

  // Render
  // Remove admin report logic, only show teacher/student report
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
            {dateFilter && <div style={{ fontSize: 13, color: '#fff', marginTop: 6 }}>Date: {dateFilter}</div>}
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

// Helper to get teacher name by id (for matching)
function getTeacherNameById(id) {
  const teachers = [
    { id: 1, name: 'Amit Sharma' },
    { id: 2, name: 'Priya Singh' },
    { id: 3, name: 'Rahul Verma' },
    { id: 4, name: 'Sunita Rao' },
    { id: 5, name: 'Vikram Patel' },
  ];
  const t = teachers.find(t => t.id === id);
  return t ? t.name : '';
} 

function ClassAttendanceModalContent({ classId, students, classes, attendanceRecords }) {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const cls = classes.find(c => c.id === classId);
  const filteredStudents = getStudentsForClass(classId, students, classes).filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  function getStudentsForClass(classId, students, classes) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return [];
    return students.filter(s => (cls.studentIds || []).includes(s.id));
  }
  function getStudentAttendanceSummary(student, classId) {
    let records = attendanceRecords.filter(r => r.classId === classId && r.studentId === student.id);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const percent = records.length > 0 ? ((present / records.length) * 100).toFixed(1) : '—';
    return { present, absent, late, percent };
  }
  function getStudentStatusOnDate(student, classId, date) {
    const rec = attendanceRecords.find(r => r.classId === classId && r.studentId === student.id && r.date === date);
    return rec ? rec.status : '—';
  }
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <input
          className="input"
          style={{ maxWidth: 220 }}
          placeholder="Search student name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          className="input"
          type="date"
          style={{ maxWidth: 150 }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 400, minWidth: 700 }}>
        <table className="attendance-details-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, background: '#3a4664', borderRadius: 12, overflow: 'hidden', minWidth: 700 }}>
          <thead style={{ background: '#394362' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#fff' }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#fff' }}>Class</th>
              <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#fff' }}>Section</th>
              {date ? (
                <th style={{ textAlign: 'center', padding: 12, fontWeight: 600, color: '#fff' }}>Status ({date})</th>
              ) : (
                <>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 600, color: '#fff' }}>Present</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 600, color: '#fff' }}>Absent</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 600, color: '#fff' }}>Late</th>
                  <th style={{ textAlign: 'center', padding: 12, fontWeight: 600, color: '#fff' }}>% Present</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={date ? 4 : 7} style={{ textAlign: 'center', color: '#fff', padding: 12 }}>No students found</td></tr>
            ) : (
              filteredStudents.map(s => {
                const summary = getStudentAttendanceSummary(s, classId);
                const status = date ? getStudentStatusOnDate(s, classId, date) : null;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: '#3a4664' }}>
                    <td style={{ padding: 12, color: '#fff' }}>{s.name}</td>
                    <td style={{ padding: 12, color: '#fff' }}>{cls ? cls.grade : ''}</td>
                    <td style={{ padding: 12, color: '#fff' }}>{cls ? cls.section : ''}</td>
                    {date ? (
                      <td style={{ textAlign: 'center', padding: 12 }}>
                        {status !== '—' ? (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor:
                              status === 'present' ? '#dcfce7' :
                              status === 'absent' ? '#fee2e2' :
                              status === 'late' ? '#fef3c7' : '#eee',
                            color:
                              status === 'present' ? '#166534' :
                              status === 'absent' ? '#92400e' :
                              status === 'late' ? '#92400e' : '#888'
                          }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        ) : <span style={{ color: '#fff' }}>—</span>}
                      </td>
                    ) : (
                      <>
                        <td style={{ textAlign: 'center', padding: 12, color: '#fff' }}>{summary.present}</td>
                        <td style={{ textAlign: 'center', padding: 12, color: '#fff' }}>{summary.absent}</td>
                        <td style={{ textAlign: 'center', padding: 12, color: '#fff' }}>{summary.late}</td>
                        <td style={{ textAlign: 'center', padding: 12, color: '#fff' }}>{summary.percent === '—' ? '—' : `${summary.percent}%`}</td>
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