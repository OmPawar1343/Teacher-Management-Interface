import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import TeacherProfileModal from '../components/TeacherProfileModal';

const initialTeachers = [
  {
    id: 1,
    name: 'Rohit Sharma',
    age: 39,
    birth: '1985-04-12',
    subject: 'Mathematics',
    hobby: 'Cricket, Sudoku, Hiking',
    email: 'rohit.sharma@school.edu',
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '1985-04-12',
    address: '123 Main St, Mumbai, India'
  },
  {
    id: 2,
    name: 'Priya Singh',
    age: 34,
    birth: '1990-08-25',
    subject: 'English',
    hobby: 'Painting, Poetry, Travel',
    email: 'priya.singh@school.edu',
    phone: '+91 91234 56789',
    gender: 'Female',
    dob: '1990-08-25',
    address: '456 Park Ave, Delhi, India'
  },
  {
    id: 3,
    name: 'Rahul Verma',
    age: 41,
    birth: '1982-12-05',
    subject: 'Physics',
    hobby: 'Marathon Running, Chess, Science Fairs',
    email: 'rahul.verma@school.edu',
    phone: '+91 99887 66554',
    gender: 'Male',
    dob: '1982-12-05',
    address: '789 Lake Rd, Bengaluru, India'
  },
  {
    id: 4,
    name: 'Sunita Rao',
    age: 36,
    birth: '1988-03-18',
    subject: 'History',
    hobby: 'Food, Reading, Quizzes',
    email: 'sunita.rao@school.edu',
    phone: '+91 90011 22334',
    gender: 'Female',
    dob: '1988-03-18',
    address: '321 Hill St, Hyderabad, India'
  },
  {
    id: 5,
    name: 'Vikram Patel',
    age: 38,
    birth: '1986-11-30',
    subject: 'Chemistry',
    hobby: 'Chess, Gardening, Robotics',
    email: 'vikram.patel@school.edu',
    phone: '+91 95555 88877',
    gender: 'Male',
    dob: '1986-11-30',
    address: '654 River Rd, Ahmedabad, India'
  },
];

function Teachers() {
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [profileModal, setProfileModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  const openModal = (type, teacher) => {
    setSelected(teacher);
    setModal(type);
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleAdd = (teacher) => {
    setTeachers([...teachers, { ...teacher, id: Date.now() }]);
    closeModal();
  };
  const handleEdit = (teacher) => {
    setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
    closeModal();
  };
  const handleDelete = () => {
    setTeachers(teachers.filter(t => t.id !== selected.id));
    closeModal();
  };

  const filteredTeachers = teachers.filter(t => {
    const q = search.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.hobby && t.hobby.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.phone && t.phone.toLowerCase().includes(q)) ||
      (t.address && t.address.toLowerCase().includes(q))
    );
  });

  const openProfileModal = (teacher) => {
    setSelected(teacher);
    setProfileModal(true);
  };
  const closeProfileModal = () => {
    setProfileModal(false);
    setSelected(null);
  };

  return (
    <div className="teachers-page" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
      <h2 style={{ textAlign: 'center', fontSize: 56, fontWeight: 800, color: '#ffffff', margin: '0 0 24px 0', letterSpacing: 1 }}>
        <span role="img" aria-label="Teachers" style={{ marginRight: 18, fontSize: 55, verticalAlign: 'middle' }}>👨‍🏫</span>
        Teachers
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
        }}>+ Add Teacher</Button>
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
          placeholder="Search teachers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <style jsx>{`
          input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}</style>
      </div>
      <div className="teacher-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {filteredTeachers.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', gridColumn: '1/-1' }}>No teachers found</div>
        ) : (
          filteredTeachers.map(t => (
            <div
              key={t.id}
              className="teacher-card"
              style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, boxShadow: '0 1px 4px #0001', padding: 24, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}
              tabIndex={0}
              onClick={() => openProfileModal(t)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openProfileModal(t); }}
              aria-label={`View details for ${t.name}`}
            >
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{t.name}</div>
              <div><b>Age:</b> {t.age}</div>
              <div><b>Birth Date:</b> {t.birth}</div>
              <div><b>Subject:</b> {t.subject || '—'}</div>
              <div><b>Hobby:</b> {t.hobby || '—'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button type="button" onClick={e => { e.stopPropagation(); openModal('edit', t); }} style={{ padding: '2px 12px', fontSize: 14, borderRadius: 4, minWidth: 0, height: 32 }}>Edit</Button>
                <Button type="button" onClick={e => { e.stopPropagation(); openModal('delete', t); }} style={{ background: '#e53e3e', padding: '2px 12px', fontSize: 14, borderRadius: 4, minWidth: 0, height: 32 }}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
      {profileModal && (
        <TeacherProfileModal
          teacher={selected}
          onEdit={t => { setProfileModal(false); openModal('edit', t); }}
          onDelete={t => { setProfileModal(false); openModal('delete', t); }}
          onClose={closeProfileModal}
        />
      )}
      {modal === 'add' && (
        <TeacherFormModal onSave={handleAdd} onClose={closeModal} />
      )}
      {modal === 'edit' && (
        <TeacherFormModal teacher={selected} onSave={handleEdit} onClose={closeModal} />
      )}
      {modal === 'delete' && (
        <Modal title="Delete Teacher" onClose={closeModal}>
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

function TeacherFormModal({ teacher, onSave, onClose }) {
  const [name, setName] = useState(teacher ? teacher.name : '');
  const [age, setAge] = useState(teacher ? teacher.age : '');
  const [birth, setBirth] = useState(teacher ? teacher.birth : '');
  const [subject, setSubject] = useState(teacher ? teacher.subject : '');
  const [hobby, setHobby] = useState(teacher ? teacher.hobby : '');
  const [email, setEmail] = useState(teacher ? teacher.email : '');
  const [phone, setPhone] = useState(teacher ? teacher.phone : '');
  const [gender, setGender] = useState(teacher ? teacher.gender : '');
  const [dob, setDob] = useState(teacher ? teacher.dob : '');
  const [address, setAddress] = useState(teacher ? teacher.address : '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure all fields are strings before calling .trim()
    const safe = v => (typeof v === 'string' ? v : (v === undefined || v === null ? '' : String(v)));
    if (
      !safe(name).trim() ||
      !safe(age).trim() ||
      !safe(birth).trim() ||
      !safe(subject).trim() ||
      !safe(hobby).trim() ||
      !safe(email).trim() ||
      !safe(phone).trim() ||
      !safe(gender).trim() ||
      !safe(dob).trim() ||
      !safe(address).trim()
    ) {
      setError('All fields are required.');
      return;
    }
    onSave({
      ...teacher,
      name,
      age: Number(age),
      birth,
      subject,
      hobby,
      email,
      phone,
      gender,
      dob,
      address
    });
  };

  return (
    <Modal title={teacher ? 'Edit Teacher' : 'Add Teacher'} onClose={onClose}>
      <div style={{ maxHeight: 320, minWidth: 260, overflowY: 'auto', paddingRight: 4 }}>
        <form onSubmit={handleSubmit} style={{ minWidth: 260, display: 'grid', gap: 10 }}>
          <label style={{ color: '#fff', fontWeight: 500 }}>Full Name</label>
          <input className="input" placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Rohit Sharma</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Age</label>
          <input className="input" type="number" placeholder="Enter age" value={age} onChange={e => setAge(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 35</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Birth Date</label>
          <input className="input" type="date" placeholder="Select birth date" value={birth} onChange={e => setBirth(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 1985-04-12</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Subject</label>
          <input className="input" placeholder="Enter subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Mathematics</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Hobby</label>
          <input className="input" placeholder="Enter hobby" value={hobby} onChange={e => setHobby(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Cricket, Sudoku</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Email</label>
          <input className="input" type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. rohit.sharma@school.edu</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Phone</label>
          <input className="input" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. +91 98765 43210</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Gender</label>
          <input className="input" placeholder="Enter gender" value={gender} onChange={e => setGender(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. Male, Female, Other</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Date of Joining</label>
          <input className="input" type="date" placeholder="Select date of joining" value={dob} onChange={e => setDob(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 2022-06-01</div>

          <label style={{ color: '#fff', fontWeight: 500 }}>Address</label>
          <input className="input" placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>E.g. 123 Main St, Mumbai, India</div>

          {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button type="submit">{teacher ? 'Save' : 'Add'}</Button>
            <Button type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default Teachers; 