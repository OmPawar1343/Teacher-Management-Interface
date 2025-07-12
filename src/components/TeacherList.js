import React, { useState } from 'react';
import TeacherCard from './TeacherCard';
import Alert from './Alert';
import TeacherProfileModal from './TeacherProfileModal';

export const initialTeachers = [
  { id: 1, name: 'Amit Sharma', subject: 'Mathematics', email: 'amit.sharma@example.com', phone: '9876543210', address: 'Delhi, India', gender: 'Male', dob: '1985-04-12', image: '' },
  { id: 2, name: 'Priya Singh', subject: 'English', email: 'priya.singh@example.com', phone: '9123456780', address: 'Mumbai, India', gender: 'Female', dob: '1990-08-22', image: '' },
  { id: 3, name: 'Rahul Verma', subject: 'Science', email: 'rahul.verma@example.com', phone: '9988776655', address: 'Bangalore, India', gender: 'Male', dob: '1988-01-15', image: '' },
  { id: 4, name: 'Sunita Rao', subject: 'History', email: 'sunita.rao@example.com', phone: '9871234567', address: 'Chennai, India', gender: 'Female', dob: '1982-11-30', image: '' },
  { id: 5, name: 'Vikram Patel', subject: 'Geography', email: 'vikram.patel@example.com', phone: '9001122334', address: 'Ahmedabad, India', gender: 'Male', dob: '1987-06-18', image: '' },
  { id: 6, name: 'Meena Joshi', subject: 'Hindi', email: 'meena.joshi@example.com', phone: '9876543211', address: 'Pune, India', gender: 'Female', dob: '1992-03-10', image: '' },
  { id: 7, name: 'Rohit Sinha', subject: 'Computer Science', email: 'rohit.sinha@example.com', phone: '9123456700', address: 'Kolkata, India', gender: 'Male', dob: '1989-09-25', image: '' },
];

const PAGE_SIZE = 4;

function TeacherList() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [showForm, setShowForm] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [profileTeacher, setProfileTeacher] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState({ message: '', type: 'success' });

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    setEditTeacher(null);
    setShowForm(true);
  };
  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setShowForm(true);
    setProfileTeacher(null);
  };
  const handleDelete = (teacher) => {
    setTeachers(teachers.filter(t => t.id !== teacher.id));
    setAlert({ message: 'Teacher deleted.', type: 'success' });
    setProfileTeacher(null);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditTeacher(null);
  };
  const handleFormSubmit = (teacher) => {
    if (teacher.id) {
      setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
      setAlert({ message: 'Teacher updated.', type: 'success' });
    } else {
      setTeachers([
        ...teachers,
        { ...teacher, id: Date.now() }
      ]);
      setAlert({ message: 'Teacher added.', type: 'success' });
    }
    setShowForm(false);
    setEditTeacher(null);
  };
  const handleAlertClose = () => setAlert({ message: '', type: 'success' });
  const handleProfile = (teacher) => setProfileTeacher(teacher);
  const handleProfileClose = () => setProfileTeacher(null);

  // Export to CSV
  const handleExportCSV = () => {
    const rows = [
      ['Name', 'Subject', 'Email', 'Phone', 'Address', 'Gender', 'DOB'],
      ...filtered.map(t => [t.name, t.subject, t.email, t.phone, t.address, t.gender, t.dob])
    ];
    const csv = rows.map(r => r.map(x => '"' + (x ? x.replace(/"/g, '""') : '') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import from CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const [header, ...rows] = lines;
      const fields = header.split(',').map(f => f.replace(/"/g, '').trim().toLowerCase());
      const newTeachers = rows.map(row => {
        const values = row.split(',').map(v => v.replace(/"/g, '').trim());
        const obj = {};
        fields.forEach((f, i) => { obj[f] = values[i] || ''; });
        return {
          id: Date.now() + Math.random(),
          name: obj.name || '',
          subject: obj.subject || '',
          email: obj.email || '',
          phone: obj.phone || '',
          address: obj.address || '',
          gender: obj.gender || '',
          dob: obj.dob || '',
          image: '',
        };
      });
      setTeachers([...teachers, ...newTeachers]);
      setAlert({ message: 'Teachers imported.', type: 'success' });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="teacher-list">
      <Alert message={alert.message} type={alert.type} onClose={handleAlertClose} />
      <div className="teacher-list-header">
        <input
          className="input"
          style={{ maxWidth: 260, marginRight: 12 }}
          placeholder="Search teachers..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          aria-label="Search teachers"
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={handleAdd}>+ Add Teacher</button>
          <button className="btn" onClick={handleExportCSV}>Export CSV</button>
          <label className="btn" style={{ margin: 0, cursor: 'pointer' }}>
            Import CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />
          </label>
        </div>
      </div>
      <div className="teacher-grid">
        {paged.map(teacher => (
          <TeacherCard key={teacher.id} teacher={teacher} onClick={handleProfile} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            className={`btn page-btn${page === i + 1 ? ' active' : ''}`}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showForm && (
        <TeacherForm
          teacher={editTeacher}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      {profileTeacher && (
        <TeacherProfileModal
          teacher={profileTeacher}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={handleProfileClose}
        />
      )}
    </div>
  );
}

function TeacherForm({ teacher, onClose, onSubmit }) {
  const [name, setName] = useState(teacher ? teacher.name : '');
  const [subject, setSubject] = useState(teacher ? teacher.subject : '');
  const [email, setEmail] = useState(teacher ? teacher.email : '');
  const [phone, setPhone] = useState(teacher ? teacher.phone : '');
  const [address, setAddress] = useState(teacher ? teacher.address : '');
  const [gender, setGender] = useState(teacher ? teacher.gender : '');
  const [dob, setDob] = useState(teacher ? teacher.dob : '');
  const [image, setImage] = useState(teacher ? teacher.image : '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !email.trim()) {
      setError('Name, subject, and email are required.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Invalid email address.');
      return;
    }
    onSubmit({
      id: teacher ? teacher.id : undefined,
      name,
      subject,
      email,
      phone,
      address,
      gender,
      dob,
      image,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>{teacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <input className="input" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="input" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          <label style={{ fontWeight: 500 }}>
            Profile Image
            <input type="file" accept="image/*" style={{ display: 'block', marginTop: 4 }} onChange={handleImageChange} />
          </label>
          {image && <img src={image} alt="Profile Preview" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0.5em 0' }} />}
          {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">{teacher ? 'Save' : 'Add'}</button>
            <button className="btn" type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherList; 