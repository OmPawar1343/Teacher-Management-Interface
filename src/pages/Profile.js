import React, { useState, useEffect } from 'react';
import Button from '../components/Button';

const initialProfile = {
  name: 'Amit Sharma',
  email: 'amit.sharma@example.com',
  subjects: 'Mathematics, Science',
  avatar: '',
};

function Profile() {
  // Load from localStorage if available
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('teacherProfile');
    return saved ? JSON.parse(saved) : initialProfile;
  });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);

  // Keep form in sync if profile changes (e.g., after save)
  useEffect(() => {
    setForm(profile);
    setAvatarPreview(profile.avatar);
  }, [profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      setAvatarPreview(event.target.result);
      setForm(f => ({ ...f, avatar: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setForm(f => ({ ...f, avatar: '' }));
  };

  const handleSave = () => {
    setProfile(form);
    localStorage.setItem('teacherProfile', JSON.stringify(form));
    setEdit(false);
  };
  const handleCancel = () => {
    setForm(profile);
    setAvatarPreview(profile.avatar);
    setEdit(false);
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="profile-section">
        <div className="profile-avatar-block">
          <label htmlFor="avatar-upload" className="profile-avatar-label">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder">Upload</div>
            )}
            {edit && (
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            )}
          </label>
          {edit && avatarPreview && (
            <Button type="button" style={{ marginTop: 8, background: '#e5e7eb', color: '#222', fontSize: '0.95em', padding: '0.3em 1em' }} onClick={handleRemoveAvatar}>
              Remove Photo
            </Button>
          )}
        </div>
        <form className="profile-form" onSubmit={e => e.preventDefault()}>
          <div className="profile-form-row">
            <label>Name</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!edit}
              required
            />
          </div>
          <div className="profile-form-row">
            <label>Email</label>
            <input
              className="input"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!edit}
              required
            />
          </div>
          <div className="profile-form-row">
            <label>Subjects Taught</label>
            <input
              className="input"
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              disabled={!edit}
              required
            />
          </div>
          <div className="profile-form-actions">
            {edit ? (
              <>
                <Button type="button" onClick={handleSave}>Save</Button>
                <Button type="button" style={{ background: '#6b7280' }} onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setEdit(true)}>Edit Profile</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile; 