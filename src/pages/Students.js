import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Papa from 'papaparse';

const initialStudents = [
  { id: 1, name: 'Rohan Mehta', gender: 'Male', roll: 1, grade: '10', section: 'A' },
  { id: 2, name: 'Sneha Kapoor', gender: 'Female', roll: 2, grade: '10', section: 'A' },
  { id: 3, name: 'Karan Desai', gender: 'Male', roll: 3, grade: '10', section: 'A' },
  { id: 4, name: 'Anjali Nair', gender: 'Female', roll: 4, grade: '10', section: 'A' },
  { id: 5, name: 'Pooja Sethi', gender: 'Female', roll: 5, grade: '10', section: 'A' },
  { id: 6, name: 'Arjun Malhotra', gender: 'Male', roll: 6, grade: '10', section: 'A' },
];
export { initialStudents };

function Students() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = React.useRef();

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const openModal = (type, student) => {
    setSelected(student);
    setModal(type);
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleAdd = (student) => {
    const newStudent = { ...student, id: Date.now(), roll: students.length + 1 };
    setStudents([...students, newStudent]);
    // Update all relevant classes' studentIds in localStorage
    const savedClasses = localStorage.getItem('classes');
    let classes = savedClasses ? JSON.parse(savedClasses) : [];
    let updated = false;
    classes.forEach(cls => {
      if (cls.grade === newStudent.grade && cls.section === newStudent.section) {
        if (!cls.studentIds) cls.studentIds = [];
        if (!cls.studentIds.includes(newStudent.id)) {
          cls.studentIds.push(newStudent.id);
          updated = true;
        }
      }
    });
    if (updated) {
      localStorage.setItem('classes', JSON.stringify(classes));
    }
    closeModal();
  };
  const handleEdit = (student) => {
    setStudents(students.map(s => s.id === student.id ? student : s));
    closeModal();
  };
  const handleDelete = () => {
    setStudents(students.filter(s => s.id !== selected.id));
    closeModal();
  };

  // CSV Export
  const handleExportCSV = () => {
    const csv = Papa.unparse(students.map(({id, ...rest}) => rest));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset all students to 10A
  const resetToDefaultClass = () => {
    const updatedStudents = students.map(student => ({
      ...student,
      grade: '10',
      section: 'A'
    }));
    setStudents(updatedStudents);
    alert('All students have been reset to class 10A');
  };

  // Reset to initial data (clear localStorage)
  const resetToInitialData = () => {
    if (window.confirm('This will reset all students to the initial data. Are you sure?')) {
      localStorage.removeItem('students');
      setStudents(initialStudents);
      alert('Students have been reset to initial data (all in 10A)');
    }
  };

  // CSV Import
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const imported = results.data.map((row, i) => ({
          id: Date.now() + i,
          name: row.name || row.Name || '',
          gender: row.gender || row.Gender || '',
          grade: row.grade || row.Grade || '10',
          section: row.section || row.Section || 'A',
          roll: Number(row.roll || row.Roll || row['Roll No'] || students.length + 1 + i),
        })).filter(r => r.name && r.gender);
        if (imported.length === 0) {
          alert('No valid students found in CSV.');
          return;
        }
        setStudents([...students, ...imported]);
      },
      error: () => alert('Failed to parse CSV.'),
    });
    e.target.value = '';
  };

  // Filter students based on search
  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.gender.toLowerCase().includes(q) ||
      s.grade?.toLowerCase().includes(q) ||
      s.section?.toLowerCase().includes(q) ||
      s.roll.toString().includes(q)
    );
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="students-page">
      <h2 style={{ textAlign: 'center', fontSize: 56, fontWeight: 800, color: '#ffffff', margin: '0 0 24px 0', letterSpacing: 1 }}>
        <span role="img" aria-label="Students" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>🧑‍🎓</span>
        Students
      </h2>
      <div className="menu-container" style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 24, 
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative'
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
        }}>+ Add Student</Button>
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
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            color: '#fff',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
        >
          ⋯
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />
        
        {/* Dropdown Menu */}
        {showMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '8px 0',
            minWidth: '160px',
            zIndex: 1000,
            marginTop: '8px'
          }}>
            <button
              onClick={() => {
                handleExportCSV();
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              📤 Export CSV
            </button>
            <button
              onClick={() => {
                fileInputRef.current.click();
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              📥 Import CSV
            </button>
            <button
              onClick={() => {
                resetToDefaultClass();
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              🔄 Reset to 10A
            </button>
            <button
              onClick={() => {
                resetToInitialData();
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              🗑️ Reset to Initial Data
            </button>
          </div>
        )}
      </div>
      <div className="students-table-wrap" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Class</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No students found</td></tr>
            ) : (
              filteredStudents.map(s => {
                // Find the class for this student by grade and section
                const classes = (() => {
                  const saved = localStorage.getItem('classes');
                  return saved ? JSON.parse(saved) : [];
                })();
                const studentClass = classes.find(cls => cls.grade === s.grade && cls.section === s.section);
                const classLabel = studentClass ? studentClass.grade : s.grade;
                const sectionLabel = studentClass ? studentClass.section : s.section;
                return (
                  <tr key={s.id}>
                    <td>{s.roll}</td>
                    <td>{s.name}</td>
                    <td>{s.gender}</td>
                    <td>{classLabel}</td>
                    <td>{sectionLabel}</td>
                    <td>
                      <Button type="button" onClick={() => openModal('edit', s)} style={{ marginRight: 4, padding: '2px 8px', fontSize: 13, borderRadius: 4, minWidth: 0, height: 28 }}>Edit</Button>
                      <Button type="button" onClick={() => openModal('delete', s)} style={{ background: '#e53e3e', padding: '2px 8px', fontSize: 13, borderRadius: 4, minWidth: 0, height: 28 }}>Delete</Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {modal === 'add' && (
        <StudentFormModal onSave={handleAdd} onClose={closeModal} />
      )}
      {modal === 'edit' && (
        <StudentFormModal student={selected} onSave={handleEdit} onClose={closeModal} />
      )}
      {modal === 'delete' && (
        <Modal title="Delete Student" onClose={closeModal}>
          <div style={{ minWidth: 260 }}>
            <p>Are you sure you want to delete <b>{selected.name}</b>?</p>
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

function StudentFormModal({ student, onSave, onClose }) {
  const [name, setName] = useState(student ? student.name : '');
  const [gender, setGender] = useState(student ? student.gender : '');
  const [grade, setGrade] = useState(student ? student.grade : '10');
  const [section, setSection] = useState(student ? student.section : 'A');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !gender || !grade.trim() || !section.trim()) {
      setError('Name, gender, class, and section are required.');
      return;
    }
    onSave({ ...student, name, gender, grade, section });
  };

  return (
    <Modal title={student ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      <div style={{ maxHeight: 320, minWidth: 260, overflowY: 'auto', paddingRight: 4 }}>
        <form onSubmit={handleSubmit} style={{ minWidth: 260, display: 'grid', gap: 10 }}>
          <label style={{ color: '#fff', fontWeight: 500 }}>Full Name</label>
          <input className="input" placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Priya Singh</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Gender</label>
          <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Female</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Class</label>
          <input className="input" placeholder="Enter class (e.g. 10)" value={grade} onChange={e => setGrade(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 10</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Section</label>
          <input className="input" placeholder="Enter section (e.g. B)" value={section} onChange={e => setSection(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. B</div>

          {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button type="submit">{student ? 'Save' : 'Add'}</Button>
            <Button type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Students; 