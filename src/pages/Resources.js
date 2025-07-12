import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { initialClasses } from './Classes';
import { initialStudents } from './Students';

function Resources() {
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('resources');
    return saved ? JSON.parse(saved) : [];
  });
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [error, setError] = useState('');
  const [trackModal, setTrackModal] = useState(null); // resource or null

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  const handleOpenModal = () => {
    setModal(true);
    setFile(null);
    setTitle('');
    setDescription('');
    setClassId('');
    setError('');
  };
  const handleCloseModal = () => {
    setModal(false);
    setFile(null);
    setTitle('');
    setDescription('');
    setClassId('');
    setError('');
  };
  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !title.trim() || !classId) {
      setError('File, title, and class are required.');
      return;
    }
    const newResource = {
      id: Date.now(),
      title,
      description,
      classId,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      uploadedAt: new Date().toLocaleString(),
    };
    setResources([newResource, ...resources]);
    handleCloseModal();
  };
  const handleDownload = (resource) => {
    const a = document.createElement('a');
    a.href = resource.fileUrl;
    a.download = resource.fileName;
    a.click();
  };
  const handleOpenTrackModal = (resource) => setTrackModal(resource);
  const handleCloseTrackModal = () => setTrackModal(null);
  const handleSaveSubmissions = (resourceId, submissions) => {
    setResources(resources.map(r => r.id === resourceId ? { ...r, submissions } : r));
    setTrackModal(null);
  };
  return (
    <div className="resources-page">
      <h2>Teaching Materials & Assignments</h2>
      <Button type="button" onClick={handleOpenModal} style={{ marginBottom: 16 }}>+ Upload Resource</Button>
      <div className="resources-list-wrap">
        {resources.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No resources uploaded yet.</div>
        ) : (
          <table className="resources-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Class</th>
                <th>File</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.description}</td>
                  <td>{getClassName(r.classId)}</td>
                  <td>{r.fileName}</td>
                  <td>{r.uploadedAt}</td>
                  <td>
                    <Button type="button" onClick={() => handleDownload(r)} style={{ marginRight: 8 }}>Download</Button>
                    {r.fileType.startsWith('image/') || r.fileType === 'application/pdf' ? (
                      <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#2563eb' }}>View</a>
                    ) : null}
                    <Button type="button" onClick={() => handleOpenTrackModal(r)} style={{ background: '#059669', marginLeft: 8 }}>Track Submissions</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <Modal title="Upload Resource" onClose={handleCloseModal}>
          <form onSubmit={handleUpload} style={{ minWidth: 260, display: 'grid', gap: 12 }}>
            <input className="input" type="file" onChange={e => setFile(e.target.files[0])} />
            <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: 60 }} />
            <select className="input" value={classId} onChange={e => setClassId(e.target.value)}>
              <option value="">Select Class</option>
              {initialClasses.map(c => (
                <option key={c.id} value={c.id}>{c.subject} {c.grade}{c.section}</option>
              ))}
            </select>
            {error && <div style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button type="submit">Upload</Button>
              <Button type="button" style={{ background: '#6b7280' }} onClick={handleCloseModal}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}
      {trackModal && (
        <TrackSubmissionsModal
          resource={trackModal}
          onClose={handleCloseTrackModal}
          onSave={handleSaveSubmissions}
        />
      )}
    </div>
  );

  function getClassName(classId) {
    const c = initialClasses.find(c => c.id === Number(classId));
    return c ? `${c.subject} ${c.grade}${c.section}` : 'Unknown';
  }
}

function TrackSubmissionsModal({ resource, onClose, onSave }) {
  // Find students in the class
  const students = initialStudents; // Replace with filtered students for the class if available
  const [submissions, setSubmissions] = useState(() => {
    // Map studentId to { status, feedback }
    const map = {};
    (resource.submissions || []).forEach(s => { map[s.studentId] = s; });
    return students.map(s => map[s.id] || { studentId: s.id, name: s.name, status: 'Pending', feedback: '' });
  });
  const handleStatusChange = (i, status) => {
    setSubmissions(submissions.map((s, idx) => idx === i ? { ...s, status } : s));
  };
  const handleFeedbackChange = (i, feedback) => {
    setSubmissions(submissions.map((s, idx) => idx === i ? { ...s, feedback } : s));
  };
  const handleSave = () => {
    onSave(resource.id, submissions);
  };
  return (
    <Modal title={`Track Submissions: ${resource.title}`} onClose={onClose}>
      <div style={{ minWidth: 320, maxHeight: 400, overflowY: 'auto' }}>
        <table className="submissions-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={s.studentId}>
                <td>{s.name}</td>
                <td>
                  <select className="input" value={s.status} onChange={e => handleStatusChange(i, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </td>
                <td>
                  <input className="input" value={s.feedback} onChange={e => handleFeedbackChange(i, e.target.value)} placeholder="Feedback..." />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button type="button" onClick={handleSave}>Save</Button>
          <Button type="button" style={{ background: '#6b7280' }} onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

export default Resources; 