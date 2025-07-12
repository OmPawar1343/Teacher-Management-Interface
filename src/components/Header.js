import React, { useState, useEffect } from 'react';

const themes = [
  { name: 'Blue', className: 'theme-blue' },
  { name: 'Green', className: 'theme-green' },
  { name: 'Purple', className: 'theme-purple' },
];

function Header() {
  const [dark, setDark] = useState(false);
  const [theme, setTheme] = useState('theme-blue');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple');
    document.body.classList.add(theme);
  }, [dark, theme]);

  return (
    <header className="app-header">
      <nav className="nav-bar">
        <span className="logo">Teacher Dashboard</span>
        <ul className="nav-links">
          <li><a href="#" aria-current="page">Home</a></li>
          <li><a href="#">About</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            aria-label="Theme color"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{ borderRadius: 8, padding: '0.3em 0.7em', fontWeight: 600 }}
          >
            {themes.map(t => (
              <option key={t.className} value={t.className}>{t.name}</option>
            ))}
          </select>
          <button
            className="btn"
            aria-label="Toggle dark mode"
            style={{ marginLeft: 8, background: dark ? '#22223b' : undefined }}
            onClick={() => setDark(d => !d)}
          >
            {dark ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header; 