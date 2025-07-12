import React from 'react';
import Avatar from './Avatar';

function TeacherProfileModal({ teacher, onEdit, onDelete, onClose, className = '' }) {
  if (!teacher) return null;
  const subject = teacher.subject || '—';
  const badgeClass = subject !== '—' ? `badge badge-${subject.toLowerCase().replace(/\s/g, '-')}` : 'badge';
  return (
    <div className={`modal-overlay teacher-profile-modal-fade ${className}`} role="dialog" aria-modal="true">
      <div className="modal teacher-profile-modal-scale">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          {teacher.image ? (
            <img src={teacher.image} alt={teacher.name} className="avatar" style={{ width: 56, height: 56, borderRadius: '50%', marginRight: 16, objectFit: 'cover' }} />
          ) : (
            <Avatar name={teacher.name} size={56} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{teacher.name}</div>
            <span className={badgeClass}>{subject}</span>
            <div className="muted" style={{ fontSize: '0.97em' }}>{teacher.email}</div>
          </div>
        </div>
        <div style={{ marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><span role="img" aria-label="Email">📧</span> <b>Email:</b> <br />{teacher.email}</div>
          <div><span role="img" aria-label="Phone">📞</span> <b>Phone:</b> <br />{teacher.phone}</div>
          <div><span role="img" aria-label="Gender">⚧️</span> <b>Gender:</b> <br />{teacher.gender}</div>
          <div><span role="img" aria-label="DOB">🎂</span> <b>DOB:</b> <br />{teacher.dob}</div>
          <div style={{ gridColumn: '1 / span 2' }}><span role="img" aria-label="Address">🏠</span> <b>Address:</b> <br />{teacher.address}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => onEdit(teacher)}>Edit</button>
          <button className="btn btn-danger" onClick={() => onDelete(teacher)}>Delete</button>
          <button className="btn" style={{ background: '#6b7280' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfileModal; 