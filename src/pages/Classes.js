import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';

const initialClasses = [
  { id: 1, subject: 'Mathematics', grade: '10', section: 'A', students: 6, teachers: [1], studentIds: [1, 2, 3, 4, 5, 6] },
  { id: 2, subject: 'Physics', grade: '10', section: 'A', students: 6, teachers: [3], studentIds: [1, 2, 3, 4, 5, 6] },
  { id: 3, subject: 'English', grade: '10', section: 'A', students: 6, teachers: [2], studentIds: [1, 2, 3, 4, 5, 6] },
  { id: 4, subject: 'History', grade: '10', section: 'A', students: 6, teachers: [4], studentIds: [1, 2, 3, 4, 5, 6] },
  { id: 5, subject: 'Chemistry', grade: '10', section: 'A', students: 6, teachers: [5], studentIds: [1, 2, 3, 4, 5, 6] },
];
export { initialClasses };

function Classes() {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState('');

  // Get live teachers from localStorage
  const teachers = (() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [];
  })();

  // Get live students from localStorage
  const students = (() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  })();

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  const openModal = (type, cls) => {
    setSelectedClass(cls);
    setModal(type);
  };
  const closeModal = () => {
    setModal(null);
    setSelectedClass(null);
  };

  const handleAdd = (cls) => {
    // Find students with matching grade and section
    const matchedStudents = students.filter(s => s.grade === cls.grade && s.section === cls.section);
    const studentIds = matchedStudents.map(s => s.id);
    const studentsCount = typeof cls.students === 'number' && !isNaN(cls.students) ? cls.students : matchedStudents.length;
    setClasses([
      ...classes,
      { ...cls, id: Date.now(), students: studentsCount, studentIds }
    ]);
    closeModal();
  };
  const handleEdit = (cls) => {
    // Find students with matching grade and section
    const matchedStudents = students.filter(s => s.grade === cls.grade && s.section === cls.section);
    const studentIds = matchedStudents.map(s => s.id);
    const studentsCount = typeof cls.students === 'number' && !isNaN(cls.students) ? cls.students : matchedStudents.length;
    setClasses(classes.map(c => c.id === cls.id ? { ...cls, students: studentsCount, studentIds } : c));
    closeModal();
  };
  const handleDelete = () => {
    setClasses(classes.filter(c => c.id !== selectedClass.id));
    closeModal();
  };

  const filteredClasses = classes.filter(c =>
    (search === '' ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.grade.toLowerCase().includes(search.toLowerCase()) ||
      c.section.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="classes-page" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', fontSize: 56, fontWeight: 800, color: '#ffffff', margin: '0 0 24px 0', letterSpacing: 1 }}>
        <span role="img" aria-label="Classes" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>📚</span>
        Classes
      </h2>
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 24, 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Button type="button" onClick={() => openModal('add', null)} style={{ 
          background: '#2563eb', 
          color: '#fff', 
          border: 'none', 
          borderRadius: 8, 
          padding: '12px 24px', 
          fontSize: 14, 
          fontWeight: 600, 
          cursor: 'pointer', 
          transition: 'background 0.2s ease',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>+ Add Class</Button>
        <input
          className="input"
          style={{ 
            maxWidth: 300,
            minWidth: 240,
            height: '44px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '0 16px',
            fontSize: 14,
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            boxSizing: 'border-box'
          }}
          placeholder="Search classes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div
        className="classes-table-scroll"
        style={{
          borderRadius: 8,
          boxShadow: '0 1px 4px #0001',
          padding: 16,
          background: 'rgba(255,255,255,0.08)',
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: 400,
        }}
      >
        <table className="classes-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: 700 }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Teachers</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#fff' }}>No classes found</td></tr>
            ) : (
              filteredClasses.map(cls => (
                <tr key={cls.id} style={{ borderBottom: '1px solid #eee', color: '#fff' }}>
                  <td style={{ padding: 8, color: '#fff' }}>{cls.subject}</td>
                  <td style={{ padding: 8, color: '#fff' }}>{cls.grade}</td>
                  <td style={{ padding: 8, color: '#fff' }}>{cls.section}</td>
                  <td style={{ padding: 8, color: '#fff' }}>
                    {cls.teachers && cls.teachers.length > 0
                      ? cls.teachers.map(tid => {
                          const t = teachers.find(tt => tt.id === tid);
                          return t ? t.name : 'Unknown';
                        }).join(', ')
                      : <span style={{ color: '#fff' }}>None</span>}
                  </td>
                  <td style={{ padding: 8, color: '#fff' }}>{cls.studentIds ? cls.studentIds.length : 0}</td>
                  <td style={{ padding: 8 }}>
                    <Button type="button" onClick={() => openModal('edit', cls)} style={{ marginRight: 4, padding: '2px 8px', fontSize: 13, borderRadius: 4, minWidth: 0, height: 28 }}>Edit</Button>
                    <Button type="button" onClick={() => openModal('delete', cls)} style={{ background: '#e53e3e', padding: '2px 8px', fontSize: 13, borderRadius: 4, minWidth: 0, height: 28 }}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modal === 'add' && (
        <ClassFormModal onSave={handleAdd} onClose={closeModal} teachers={teachers} />
      )}
      {modal === 'edit' && (
        <ClassFormModal classData={selectedClass} onSave={handleEdit} onClose={closeModal} teachers={teachers} />
      )}
      {modal === 'delete' && (
        <Modal title="Delete Class" onClose={closeModal}>
          <div style={{ minWidth: 260 }}>
            <p>Are you sure you want to delete <b>{selectedClass.subject} {selectedClass.grade}{selectedClass.section}</b>?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                onClick={handleDelete}
                style={{
                  background: '#e53e3e',
                  padding: '2px 16px',
                  fontSize: 14,
                  borderRadius: 4,
                  minWidth: 0,
                  height: 32,
                  fontWeight: 600,
                  color: '#fff',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Delete
              </Button>
              <Button
                type="button"
                onClick={closeModal}
                style={{
                  background: '#6b7280',
                  padding: '2px 16px',
                  fontSize: 14,
                  borderRadius: 4,
                  minWidth: 0,
                  height: 32,
                  fontWeight: 600,
                  color: '#fff',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ClassFormModal({ classData, onSave, onClose, teachers }) {
  const [subject, setSubject] = useState(classData ? classData.subject : '');
  const [grade, setGrade] = useState(classData ? classData.grade : '');
  const [section, setSection] = useState(classData ? classData.section : '');
  const [selectedTeachers, setSelectedTeachers] = useState(classData ? classData.teachers || [] : []);
  const [studentsCount, setStudentsCount] = useState(classData ? classData.students || '' : '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !grade.trim() || !section.trim()) {
      setError('All fields are required.');
      return;
    }
    // Pass studentsCount as students if provided, else let parent logic auto-calculate
    onSave({ ...classData, subject, grade, section, teachers: selectedTeachers, students: studentsCount ? Number(studentsCount) : undefined });
  };

  return (
    <Modal title={classData ? 'Edit Class' : 'Add Class'} onClose={onClose}>
      <div style={{ maxHeight: 320, minWidth: 260, overflowY: 'auto', paddingRight: 4 }}>
        <form onSubmit={handleSubmit} style={{ minWidth: 260, display: 'grid', gap: 10 }}>
          <label style={{ color: '#fff', fontWeight: 500 }}>Subject</label>
          <input className="input" placeholder="Enter subject (e.g. Mathematics)" value={subject} onChange={e => setSubject(e.target.value)} autoFocus />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Mathematics</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Grade</label>
          <input className="input" placeholder="Enter grade (e.g. 10)" value={grade} onChange={e => setGrade(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 10</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Section</label>
          <input className="input" placeholder="Enter section (e.g. B)" value={section} onChange={e => setSection(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. B</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Assign Teachers</label>
          <select
            className="input"
            multiple
            value={selectedTeachers}
            onChange={e => setSelectedTeachers(Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
            style={{ minHeight: 80 }}
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>Hold Ctrl (Cmd on Mac) to select multiple</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Number of Students</label>
          <input className="input" type="number" min="0" placeholder="Enter number of students (optional)" value={studentsCount} onChange={e => setStudentsCount(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 35</div>

          {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button type="submit">{classData ? 'Save' : 'Add'}</Button>
            <Button type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Classes; 