import React from 'react';

function Card({ title, value, icon }) {
  return (
    <div className="card-widget">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
}

export default Card; 