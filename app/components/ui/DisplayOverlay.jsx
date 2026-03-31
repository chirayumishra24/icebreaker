'use client';

import { useEffect, useMemo, useRef } from 'react';
import useGameStore from '../../store/gameStore';
import { PHASES, ACTIONS, SONG_LYRICS, VIDEO_URL } from '../../lib/constants';
import { playClick, playWhoosh, playPop, playCelebration, playTick, playSuccess } from '../../lib/sounds';

const PHASE_ORDER = [
  PHASES.WELCOME, PHASES.SONG, PHASES.ADD_STUDENT,
  PHASES.SPOTLIGHT, PHASES.MEMORY_CHAIN, PHASES.FINALE,
];

// Comic character images per phase
const PHASE_CHARACTERS = {
  [PHASES.WELCOME]: '/comic-mentor.png',
  [PHASES.SONG]: '/comic-singing.png',
  [PHASES.SPOTLIGHT]: '/comic-spotlight.png',
  [PHASES.MEMORY_CHAIN]: '/comic-chain.png',
  [PHASES.FINALE]: '/comic-celebrate.png',
};

export default function DisplayOverlay({ isFullscreen, toggleFullscreen }) {
  const phase = useGameStore((s) => s.phase);
  const students = useGameStore((s) => s.students);
  const currentStudentIndex = useGameStore((s) => s.currentStudentIndex);
  const newStudentName = useGameStore((s) => s.newStudentName);
  const selectedAction = useGameStore((s) => s.selectedAction);
  const isReplaying = useGameStore((s) => s.isReplaying);
  const replayIndex = useGameStore((s) => s.replayIndex);
  const celebrationActive = useGameStore((s) => s.celebrationActive);

  const setNewStudentName = useGameStore((s) => s.setNewStudentName);
  const setSelectedAction = useGameStore((s) => s.setSelectedAction);
  const addStudent = useGameStore((s) => s.addStudent);
  const goToSong = useGameStore((s) => s.goToSong);
  const goToAddStudent = useGameStore((s) => s.goToAddStudent);
  const goToMemoryChain = useGameStore((s) => s.goToMemoryChain);
  const goToFinale = useGameStore((s) => s.goToFinale);
  const startReplay = useGameStore((s) => s.startReplay);
  const advanceReplay = useGameStore((s) => s.advanceReplay);
  const resetGame = useGameStore((s) => s.resetGame);

  const currentStudent = students[currentStudentIndex];
  const currentPhaseIndex = PHASE_ORDER.indexOf(phase);

  // Auto-advance replay with tick sound
  useEffect(() => {
    if (isReplaying && replayIndex >= 0) {
      playTick();
      const timer = setTimeout(() => advanceReplay(), 900);
      return () => clearTimeout(timer);
    }
  }, [isReplaying, replayIndex, advanceReplay]);

  // Play celebration sound when finale starts
  useEffect(() => {
    if (celebrationActive) playCelebration();
  }, [celebrationActive]);

  // Play whoosh on phase change
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      playWhoosh();
      prevPhaseRef.current = phase;
    }
  }, [phase]);

  // Confetti
  const confetti = useMemo(() => {
    if (!celebrationActive) return null;
    const colors = ['#f97316', '#ec4899', '#3b82f6', '#22c55e', '#fbbf24', '#8b5cf6'];
    return Array.from({ length: 60 }, (_, i) => (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: colors[i % colors.length],
          animationDuration: `${2.5 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 2}s`,
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
        }}
      />
    ));
  }, [celebrationActive]);

  // Fullscreen handler with sound
  const handleToggleFullscreen = () => {
    playClick();
    toggleFullscreen();
  };

  // Wrapped action handlers with sound
  const handleGoToSong = () => { playClick(); goToSong(); };
  const handleGoToAddStudent = () => { playClick(); goToAddStudent(); };
  const handleGoToMemoryChain = () => { playClick(); goToMemoryChain(); };
  const handleGoToFinale = () => { playSuccess(); goToFinale(); };
  const handleAddStudent = () => { playPop(); addStudent(); };
  const handleStartReplay = () => { playClick(); startReplay(); };
  const handleResetGame = () => { playClick(); resetGame(); };
  const handleSelectAction = (action) => { playClick(); setSelectedAction(action); };

  // Song URL with autoplay
  const songAutoplayURL = VIDEO_URL + '&autoplay=1';

  return (
    <>
      {/* String lights */}
      <div className="string-lights" />

      {/* Fullscreen */}
      <button className="fullscreen-btn" onClick={handleToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}>
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      {/* Progress dots */}
      <div className="progress-dots">
        {PHASE_ORDER.map((p, i) => (
          <div
            key={p}
            className={`progress-dot ${i === currentPhaseIndex ? 'active' : ''} ${i < currentPhaseIndex ? 'done' : ''}`}
          />
        ))}
      </div>

      {/* Confetti */}
      {celebrationActive && <div className="confetti">{confetti}</div>}

      <div className="wizard-overlay">

        {/* ===== WELCOME ===== */}
        {phase === PHASES.WELCOME && (
          <div className="step-card compact" key="welcome">
            <img src={PHASE_CHARACTERS[PHASES.WELCOME]} alt="Mentor" className="comic-character comic-character-lg" />
            <h1 className="step-title-orange" style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>
              Jump In, Jump Out!
            </h1>
            <p className="step-subtitle" style={{ marginBottom: '0.8rem' }}>
              Let&apos;s Introduce Ourselves — Watch how it works!
            </p>
            <div className="video-wrapper">
              <iframe
                src={VIDEO_URL}
                title="Jump In Jump Out Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="btn-row">
              <button className="btn btn-lg btn-primary" onClick={handleGoToSong}>
                🎵 Let&apos;s Begin!
              </button>
            </div>
          </div>
        )}

        {/* ===== SONG TIME ===== */}
        {phase === PHASES.SONG && (
          <div className="step-card compact narrow" key="song">
            <img src={PHASE_CHARACTERS[PHASES.SONG]} alt="Singing" className="comic-character comic-character-md" />
            <div className="step-badge">Step 1 — Sing Together</div>
            <h1 className="step-title-orange" style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>🎤 Song Time!</h1>
            <p className="step-subtitle" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Everyone sing and do the actions together!
            </p>
            {/* Actual song plays via YouTube */}
            <div className="video-wrapper" style={{ marginBottom: '0.5rem' }}>
              <iframe
                src={songAutoplayURL}
                title="Jump In Jump Out Song"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="lyrics-box" style={{ padding: '0.5rem 1rem', marginBottom: '0.4rem' }}>
              {SONG_LYRICS.map((line, i) => (
                <div key={i} className="lyrics-line" style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>
                  {i === 3 ? <span className="lyrics-highlight">{line}</span> : line}
                </div>
              ))}
            </div>
            <div className="mentor-tip" style={{ padding: '0.4rem 0.8rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <strong>Mentor:</strong> &quot;Hi! My name is [Your Name]. I like reading books!&quot;
            </div>
            <div className="btn-row">
              <button className="btn btn-lg btn-primary" onClick={handleGoToAddStudent}>
                Done Singing — Next! ✨
              </button>
            </div>
          </div>
        )}

        {/* ===== ADD STUDENT ===== */}
        {phase === PHASES.ADD_STUDENT && (
          <div className="step-card compact wide" key="add-student">
            <div className="step-badge">
              Step 2 — Student #{students.length + 1}
            </div>
            <h1 className="step-title" style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
              Who&apos;s Next? 🙋
            </h1>
            <p className="step-subtitle" style={{ marginBottom: '0.8rem', fontSize: '1rem' }}>
              Type the student&apos;s name, then pick what they like!
            </p>

            <input
              type="text"
              className="name-input"
              placeholder="Enter student name..."
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              autoFocus
            />

            <div className="action-grid">
              {ACTIONS.map((action) => (
                <div
                  key={action.id}
                  className={`action-card ${selectedAction?.id === action.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAction(action)}
                >
                  <img src={action.icon} alt={action.label} className="action-card-icon" />
                  <span className="action-card-label">{action.label}</span>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button
                className="btn btn-lg btn-primary"
                disabled={!newStudentName.trim() || !selectedAction}
                onClick={handleAddStudent}
              >
                ✅ Add {newStudentName.trim() || 'Student'}
              </button>
              {students.length >= 2 && (
                <button className="btn btn-md btn-success" onClick={handleGoToFinale}>
                  🎉 Grand Finale
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== SPOTLIGHT ===== */}
        {phase === PHASES.SPOTLIGHT && currentStudent && (
          <div className="step-card compact" key={`spotlight-${currentStudent.id}`}>
            <img src={PHASE_CHARACTERS[PHASES.SPOTLIGHT]} alt="Spotlight" className="comic-character comic-character-sm" />
            <div className="step-badge">Everyone Sing! 🎶</div>
            <div className="lyrics-box" style={{ marginBottom: '1rem', padding: '1rem 1.5rem' }}>
              {SONG_LYRICS.map((line, i) => (
                <div key={i} className="lyrics-line" style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                  {i === 3 ? <span className="lyrics-highlight">{line}</span> : line}
                </div>
              ))}
            </div>

            <div className="spotlight-name">{currentStudent.name}</div>
            <div className="spotlight-action">
              <img src={currentStudent.icon} alt={currentStudent.label} className="spotlight-icon" />
              <span className="spotlight-text">
                &ldquo;I like <strong>{currentStudent.label}</strong>!&rdquo;
              </span>
            </div>

            <div className="btn-row">
              <button className="btn btn-lg btn-primary" onClick={handleGoToAddStudent}>
                Add Next Student ➡️
              </button>
              {students.length > 1 && (
                <button className="btn btn-md btn-secondary" onClick={handleGoToMemoryChain}>
                  🔗 Memory Chain
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== MEMORY CHAIN ===== */}
        {phase === PHASES.MEMORY_CHAIN && (
          <div className="step-card compact wide" key="memory-chain">
            <img src={PHASE_CHARACTERS[PHASES.MEMORY_CHAIN]} alt="Chain" className="comic-character comic-character-sm" />
            <div className="step-badge">Memory Chain 🔗</div>
            <h1 className="step-title" style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
              {students.length} Action{students.length > 1 ? 's' : ''} Learned!
            </h1>
            <p className="step-subtitle" style={{ marginBottom: '0.8rem', fontSize: '1rem' }}>
              {isReplaying
                ? `▶ Replaying: ${replayIndex + 1} of ${students.length}...`
                : 'Everyone repeat all the actions together!'}
            </p>

            <div className="chain-grid">
              {students.map((s, i) => (
                <div key={s.id} className="chain-item">
                  <div
                    className={`chain-card ${isReplaying && replayIndex === i ? 'replaying' : ''}`}
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      borderColor: isReplaying && replayIndex === i ? s.color : undefined,
                    }}
                  >
                    <img src={s.icon} alt={s.label} className="chain-card-icon" />
                    <span className="chain-card-name">{s.name}</span>
                    <span className="chain-card-label">{s.label}</span>
                  </div>
                  {i < students.length - 1 && <span className="chain-arrow">→</span>}
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn btn-md btn-secondary" onClick={handleStartReplay} disabled={isReplaying}>
                {isReplaying ? '▶ Replaying...' : '▶ Replay Chain'}
              </button>
              <button className="btn btn-md btn-primary" onClick={handleGoToAddStudent}>
                ➕ Add Next Student
              </button>
              {students.length >= 2 && (
                <button className="btn btn-md btn-success" onClick={handleGoToFinale}>
                  🎉 Grand Finale
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== GRAND FINALE ===== */}
        {phase === PHASES.FINALE && (
          <div className="step-card compact wide" key="finale">
            <img src={PHASE_CHARACTERS[PHASES.FINALE]} alt="Celebrate" className="comic-character comic-character-lg" />
            <div className="celebration-title">🎉 Amazing Job! 🎉</div>
            <div className="celebration-sub">
              You remembered {students.length} action{students.length > 1 ? 's' : ''}!
            </div>

            <div className="chain-grid">
              {students.map((s, i) => (
                <div key={s.id} className="chain-item">
                  <div
                    className={`chain-card ${isReplaying && replayIndex === i ? 'replaying' : ''}`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      borderColor: isReplaying && replayIndex === i ? s.color : undefined,
                    }}
                  >
                    <img src={s.icon} alt={s.label} className="chain-card-icon" />
                    <span className="chain-card-name">{s.name}</span>
                    <span className="chain-card-label">{s.label}</span>
                  </div>
                  {i < students.length - 1 && <span className="chain-arrow">→</span>}
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn btn-md btn-secondary" onClick={handleStartReplay} disabled={isReplaying}>
                {isReplaying ? '▶ Replaying...' : '🔄 Replay All'}
              </button>
              <button className="btn btn-md btn-danger" onClick={handleResetGame}>
                🔁 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
