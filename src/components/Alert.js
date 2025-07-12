import React, { useEffect } from 'react';

function Alert({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
}

export default Alert; 