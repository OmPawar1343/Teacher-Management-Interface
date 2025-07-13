import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import CalendarPage from './pages/Calendar';
import Report from './pages/Report';
import Teachers from './pages/Teachers';
import Schedule from './pages/Schedule';
import BlurText from './BlurText';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/global.css';

function App() {
  const [page, setPage] = useState('dashboard');
  const [showMain, setShowMain] = useState(false);

  let content;
  if (page === 'dashboard') content = <Dashboard onNavigate={setPage} />;
  else if (page === 'students') content = <Students />;
  else if (page === 'classes') content = <Classes />;
  else if (page === 'attendance') content = <Attendance />;
  else if (page === 'calendar') content = <CalendarPage />;
  else if (page === 'report') content = <Report />;
  else if (page === 'teachers') content = <Teachers />;
  else if (page === 'schedule') content = <Schedule />;

  // Handler for when the intro animation completes
  const handleIntroComplete = () => {
    setTimeout(() => setShowMain(true), 1000); // 1s pause after animation
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!showMain ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            style={{
              minHeight: '100vh',
              width: '100vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 2,
              position: 'fixed',
              top: 0,
              left: 0,
              background: 'linear-gradient(120deg, #232946 0%, #1e293b 100%)',
              overflow: 'hidden',
            }}
          >
            {/* Animated background particles for splash, matching main app */}
            <div className="animated-bg-particles" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <div className="particle particle1" />
              <div className="particle particle2" />
              <div className="particle particle3" />
              <div className="particle particle4" />
              <div className="particle particle5" />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
              <BlurText
                text="Welcome to Teacher Management Interface"
                delay={350}
                animateBy="words"
                direction="top"
                stepDuration={0.6}
                onAnimationComplete={handleIntroComplete}
                className="portfolio-intro-text dashboard-title-splash"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.7 } }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
    <div className="app-layout">
              <TopBar current={page} onNavigate={setPage} onLogout={() => setPage('dashboard')} />
              <main className="main-content">
                <div className="animated-bg-particles" aria-hidden="true">
                  <div className="particle particle1" />
                  <div className="particle particle2" />
                  <div className="particle particle3" />
                  <div className="particle particle4" />
                  <div className="particle particle5" />
                </div>
                {content}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
