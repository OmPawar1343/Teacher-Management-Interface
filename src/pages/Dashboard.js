import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

function Dashboard({ onNavigate }) {
  // Live state for students, classes, events, subjects, messages
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : [];
  });
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, date: '2024-04-25', title: 'Science Fair', description: 'Science Fair' },
      { id: 2, date: '2024-04-28', title: 'Math Exam', description: 'Math Exam' },
      { id: 3, date: '2024-05-05', title: 'Field Trip', description: 'Field Trip' },
    ];
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });
  const unreadMessages = messages.filter(m => m.read === false).length;
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [];
  });
  const [scheduleEventsCount, setScheduleEventsCount] = useState(0);
  // Add live report count for the Report card
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    function updateScheduleEventsCount() {
      const saved = localStorage.getItem('schoolCalendarEvents');
      if (saved) {
        setScheduleEventsCount(JSON.parse(saved).length);
      } else {
        setScheduleEventsCount(0);
      }
    }
    updateScheduleEventsCount();
    window.addEventListener('storage', updateScheduleEventsCount);
    const interval = setInterval(updateScheduleEventsCount, 1000);
    return () => {
      window.removeEventListener('storage', updateScheduleEventsCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function updateReportCount() {
      const savedStudents = localStorage.getItem('students');
      const savedClasses = localStorage.getItem('classes');
      const students = savedStudents ? JSON.parse(savedStudents) : [];
      const classes = savedClasses ? JSON.parse(savedClasses) : [];
      // Only count students who belong to a class (i.e., are in a class's studentIds array)
      const studentsInAClass = students.filter(s => classes.some(cls => (cls.studentIds || []).includes(s.id)));
      setReportCount(studentsInAClass.length);
    }
    updateReportCount();
    window.addEventListener('storage', updateReportCount);
    const interval = setInterval(updateReportCount, 1000);
    return () => {
      window.removeEventListener('storage', updateReportCount);
      clearInterval(interval);
    };
  }, []);

  // Demo notifications
  const notifications = [
    'New student registered',
    'Class rescheduled',
  ];
  // Remove demo studentPerformance, use real students
  const [search, setSearch] = useState('');

  // Helper to get class label for a student
  function getClassLabel(student) {
    const studentClass = classes.find(cls => cls.grade === student.grade && cls.section === student.section);
    return studentClass ? `${studentClass.subject} ${studentClass.grade}${studentClass.section}` : `${student.grade}${student.section}`;
  }

  return (
    <div className="dashboard-page" style={{ minHeight: '100vh', padding: 0, position: 'relative' }}>
      {/* Centered Dashboard heading */}
      <h1 style={{ textAlign: 'center', fontSize: 56, fontWeight: 800, color: '#ffffff', margin: '0', paddingTop: 32, letterSpacing: 1 }}>
        <span role="img" aria-label="Dashboard" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>🏠</span>
        Dashboard
      </h1>
      {/* Summary cards (clickable) */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '32px', justifyContent: 'center' }} className="dashboard-cards-row">
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('teachers')}><Card title="Teachers" value={teachers.length} icon={<span style={{ fontSize: 32 }}>👨‍🏫</span>} /></div>
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('students')}><Card title="Students" value={students.length} icon={<span style={{ fontSize: 32 }}>🧑‍🎓</span>} /></div>
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('classes')}><Card title="Classes" value={classes.length} icon={<span style={{ fontSize: 32 }}>📚</span>} /></div>
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('attendance')}><Card title="Attendance" value={students.length} icon={<span style={{ fontSize: 32 }}>📝</span>} /></div>
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('schedule')}><Card title="Schedule" value={scheduleEventsCount} icon={<span style={{ fontSize: 32 }}>️📅</span>} /></div>
        <div style={{ flex: 1, maxWidth: '200px', width: '100%', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('report')}><Card title="Report" value={reportCount} icon={<span style={{ fontSize: 32 }}>📊</span>} /></div>
      </div>
      <style jsx>{`
        @media (max-width: 700px) {
          .dashboard-cards-row {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard; 