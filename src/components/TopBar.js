import React, { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: '🏠', page: 'dashboard' },
  { label: 'Teachers', icon: '👨‍🏫', page: 'teachers' },
  { label: 'Students', icon: '🧑‍🎓', page: 'students' },
  { label: 'Classes', icon: '📚', page: 'classes' },
  { label: 'Attendance', icon: '📝', page: 'attendance' },
  { label: 'Schedule', icon: '🗓️', page: 'schedule' },
  { label: 'Reports', icon: '📊', page: 'report' },
];

function TopBar({ current, onNavigate, unreadMessages = 0, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar" style={{
      background: '#223046',
      color: '#fff',
      height: '70px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Centered Title */}
      <div className="topbar-logo" style={{
        fontWeight: 700,
        fontSize: 36,
        letterSpacing: 1,
        color: '#60a5fa',
        position: 'absolute',
        left: 0,
        right: 0,
        margin: '0 auto',
        textAlign: 'center',
        zIndex: 1001,
        pointerEvents: 'none',
      }}>
        TEACHER MANAGEMENT
      </div>
      {/* Hamburger menu button */}
      <button
        className="hamburger-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          padding: 10,
          borderRadius: 6,
          position: 'absolute',
          left: 16,
          zIndex: 1002,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <div style={{ width: 24, height: 3, background: '#fff', borderRadius: 2 }} />
        <div style={{ width: 24, height: 3, background: '#fff', borderRadius: 2 }} />
        <div style={{ width: 24, height: 3, background: '#fff', borderRadius: 2 }} />
      </button>
      {/* Dropdown menu */}
      {menuOpen && (
        <div
          className="topbar-dropdown"
          style={{
            position: 'absolute',
            top: '70px',
            left: 16,
            background: '#223046',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: '16px 0',
            minWidth: 220,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            animation: 'fadeInMenu 0.25s',
          }}
        >
          {navItems.map(item => (
            <button
              key={item.page}
              className={`topbar-link${current === item.page ? ' active' : ''}`}
              onClick={() => {
                onNavigate(item.page);
                setMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: current === item.page ? '#fff2' : 'none',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                gap: '12px',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (current !== item.page) {
                  e.target.style.background = '#fff1';
                }
              }}
              onMouseLeave={e => {
                if (current !== item.page) {
                  e.target.style.background = 'none';
                }
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default TopBar; 