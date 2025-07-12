import React from 'react';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal classes-modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal; 