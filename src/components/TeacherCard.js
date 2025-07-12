import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';

function TeacherCard({ teacher, onClick }) {
  return (
    <div className="teacher-card" tabIndex={0} aria-label={`Teacher: ${teacher.name}`} onClick={() => onClick(teacher)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {teacher.image ? (
          <img src={teacher.image} alt={teacher.name} className="avatar" style={{ width: 44, height: 44, borderRadius: '50%', marginRight: 14, objectFit: 'cover' }} />
        ) : (
          <Avatar name={teacher.name} size={44} />
        )}
        <div className="teacher-card-details">
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{teacher.name}</div>
          <span className={`badge badge-${teacher.subject.toLowerCase().replace(/\s/g, '-')}`}>{teacher.subject}</span>
          <div className="muted" style={{ fontSize: '0.95em' }}>{teacher.email}</div>
        </div>
      </div>
    </div>
  );
}

TeacherCard.propTypes = {
  teacher: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TeacherCard; 