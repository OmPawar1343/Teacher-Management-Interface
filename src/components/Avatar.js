import React from 'react';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

function Avatar({ name, size = 40 }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const bg = stringToColor(name);
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.45,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        userSelect: 'none',
        marginRight: 14,
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </span>
  );
}

export default Avatar; 