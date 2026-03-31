'use client';

import { useEffect, useMemo, useRef, useCallback } from 'react';
import useGameStore from '../../store/gameStore';
import { PHASES, APPRECIATIONS, SONG_LYRICS, VIDEO_URL } from '../../lib/constants';
import { playClick, playWhoosh, playPop, playCelebration, playTick, playSuccess } from '../../lib/sounds';

const PHASE_ORDER = [
  PHASES.WELCOME, PHASES.SONG, PHASES.ADD_STUDENT, PHASES.FINALE,
];

// Comic character images per phase
const PHASE_CHARACTERS = {
  [PHASES.WELCOME]: '/comic-mentor.png',
  [PHASES.SONG]: '/comic-singing.png',
  [PHASES.FINALE]: '/comic-celebrate.png',
};

export default function DisplayOverlay({ isFullscreen, toggleFullscreen }) {
  const phase = useGameStore((s) => s.phase);
  const appreciationIndex = useGameStore((s) => s.appreciationIndex);
  const isReplaying = useGameStore((s) => s.isReplaying);
  const replayIndex = useGameStore((s) => s.replayIndex);
  const celebrationActive = useGameStore((s) => s.celebrationActive);

  const goToSong = useGameStore((s) => s.goToSong);
  const goToAppreciation = useGameStore((s) => s.goToAppreciation);
  const advanceAppreciation = useGameStore((s) => s.advanceAppreciation);
  const goToFinale = useGameStore((s) => s.goToFinale);
  const resetGame = useGameStore((s) => s.resetGame);

  const currentPhaseIndex = PHASE_ORDER.indexOf(phase);
  const currentAppreciation = APPRECIATIONS[appreciationIndex];

  // Listen for Enter key to advance appreciation
  const handleAdvanceAppreciation = useCallback(() => {
    playPop();
    advanceAppreciation();
  }, [advanceAppreciation]);

  useEffect(() => {
    if (phase !== PHASES.ADD_STUDENT) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdvanceAppreciation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleAdvanceAppreciation]);

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
  const handleGoToAppreciation = () => { playClick(); goToAppreciation(); };
  const handleGoToFinale = () => { playSuccess(); goToFinale(); };
  const handleResetGame = () => { playClick(); resetGame(); };

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
              <button className="btn btn-lg btn-primary" onClick={handleGoToAppreciation}>
                Done Singing — Next! ✨
              </button>
            </div>
          </div>
        )}

        {/* ===== APPRECIATION SLIDES ===== */}
        {phase === PHASES.ADD_STUDENT && currentAppreciation && (
          <div className="step-card compact wide" key={`appreciation-${appreciationIndex}`}>
            <div className="step-badge">
              Slide {appreciationIndex + 1} of {APPRECIATIONS.length}
            </div>

            <div className="slide-wrapper">
              <img
                src={currentAppreciation.image}
                alt={currentAppreciation.title}
                className="slide-image"
              />
              <div className="slide-caption" style={{ '--accent-color': currentAppreciation.color }}>
                <span className="slide-caption-emoji">{currentAppreciation.emoji}</span>
                <span className="slide-caption-title">{currentAppreciation.title}</span>
              </div>
            </div>

            <p className="appreciation-message">{currentAppreciation.message}</p>

            {/* Progress dots */}
            <div className="appreciation-progress">
              {APPRECIATIONS.map((_, i) => (
                <div
                  key={i}
                  className={`appreciation-dot ${i === appreciationIndex ? 'active' : ''} ${i < appreciationIndex ? 'done' : ''}`}
                />
              ))}
            </div>

            <div className="appreciation-hint">
              ⏎ Press <strong>Enter</strong> for next slide
            </div>

            <div className="btn-row">
              <button className="btn btn-lg btn-primary" onClick={handleAdvanceAppreciation}>
                {appreciationIndex < APPRECIATIONS.length - 1 ? '✨ Next Slide' : '🎉 Grand Finale!'}
              </button>
            </div>
          </div>
        )}

        {/* ===== GRAND FINALE ===== */}
        {phase === PHASES.FINALE && (
          <div className="step-card compact wide" key="finale">
            <img src={PHASE_CHARACTERS[PHASES.FINALE]} alt="Celebrate" className="comic-character comic-character-lg" />
            <div className="celebration-title">🎉 Amazing Job! 🎉</div>
            <div className="celebration-sub">
              You&apos;re all superstars! Keep shining! ⭐
            </div>

            <div className="appreciation-recap">
              {APPRECIATIONS.map((a, i) => (
                <div key={i} className="recap-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="recap-emoji">{a.emoji}</span>
                  <span className="recap-title">{a.title}</span>
                </div>
              ))}
            </div>

            <div className="btn-row">
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
