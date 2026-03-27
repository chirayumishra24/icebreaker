'use client';

import { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { ACTIONS, PHASES } from '../../lib/constants';

export default function TeacherControls() {
  const phase = useGameStore((s) => s.phase);
  const students = useGameStore((s) => s.students);
  const newStudentName = useGameStore((s) => s.newStudentName);
  const selectedAction = useGameStore((s) => s.selectedAction);
  const showControls = useGameStore((s) => s.showControls);
  const isReplaying = useGameStore((s) => s.isReplaying);

  const setNewStudentName = useGameStore((s) => s.setNewStudentName);
  const setSelectedAction = useGameStore((s) => s.setSelectedAction);
  const addStudent = useGameStore((s) => s.addStudent);
  const startIntro = useGameStore((s) => s.startIntro);
  const startMemoryChain = useGameStore((s) => s.startMemoryChain);
  const startReplay = useGameStore((s) => s.startReplay);
  const readyForNextStudent = useGameStore((s) => s.readyForNextStudent);
  const startFinale = useGameStore((s) => s.startFinale);
  const resetGame = useGameStore((s) => s.resetGame);
  const toggleControls = useGameStore((s) => s.toggleControls);

  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedAction) {
      addStudent();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddStudent();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        className="controls-toggle"
        onClick={toggleControls}
        title={showControls ? 'Hide Controls' : 'Show Controls'}
      >
        {showControls ? '▼' : '▲'}
      </button>

      {/* Main controls bar */}
      <div className={`teacher-controls ${!showControls ? 'hidden' : ''}`}>

        {/* === INTRO PHASE CONTROLS === */}
        {phase === PHASES.INTRO && (
          <div className="control-buttons" style={{ width: '100%', justifyContent: 'center' }}>
            <button className="ctrl-btn ctrl-btn-accent" onClick={() => {
              startIntro();
              readyForNextStudent();
            }}>
              🎬 Start Activity
            </button>
          </div>
        )}

        {/* === STUDENT TURN CONTROLS === */}
        {phase === PHASES.STUDENT_TURN && (
          <>
            {/* Student name input */}
            <div className="student-input-group">
              <input
                type="text"
                className="student-input"
                placeholder="Student name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            {/* Action grid — using PNG icons */}
            <div className="action-grid">
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  className={`action-btn ${selectedAction?.id === action.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAction(action)}
                  title={action.label}
                  style={selectedAction?.id === action.id ? { borderColor: action.color } : {}}
                >
                  <span className="action-btn-tooltip">{action.label}</span>
                  <img
                    src={action.icon}
                    alt={action.label}
                    className="action-btn-icon"
                  />
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="control-buttons">
              <button
                className="ctrl-btn ctrl-btn-primary"
                onClick={handleAddStudent}
                disabled={!newStudentName.trim() || !selectedAction}
              >
                ✅ Add Student
              </button>

              {students.length > 0 && (
                <>
                  <button
                    className="ctrl-btn ctrl-btn-accent"
                    onClick={startMemoryChain}
                  >
                    🔗 Memory Chain
                  </button>
                  {students.length >= 2 && (
                    <button
                      className="ctrl-btn ctrl-btn-success"
                      onClick={startFinale}
                    >
                      🎉 Grand Finale
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* === MEMORY CHAIN CONTROLS === */}
        {phase === PHASES.MEMORY_CHAIN && (
          <div className="control-buttons" style={{ width: '100%', justifyContent: 'center', gap: '1rem' }}>
            <button
              className="ctrl-btn ctrl-btn-primary"
              onClick={startReplay}
              disabled={isReplaying}
            >
              {isReplaying ? '▶ Replaying...' : '▶ Replay Chain'}
            </button>
            <button
              className="ctrl-btn ctrl-btn-accent"
              onClick={readyForNextStudent}
            >
              ➕ Next Student
            </button>
            {students.length >= 2 && (
              <button
                className="ctrl-btn ctrl-btn-success"
                onClick={startFinale}
              >
                🎉 Grand Finale
              </button>
            )}
          </div>
        )}

        {/* === FINALE CONTROLS === */}
        {phase === PHASES.FINALE && (
          <div className="control-buttons" style={{ width: '100%', justifyContent: 'center', gap: '1rem' }}>
            <button
              className="ctrl-btn ctrl-btn-primary"
              onClick={startReplay}
              disabled={isReplaying}
            >
              {isReplaying ? '▶ Replaying...' : '🔄 Replay All'}
            </button>
            <button
              className="ctrl-btn ctrl-btn-danger"
              onClick={resetGame}
            >
              🔁 Start Over
            </button>
          </div>
        )}

        {/* Reset (always visible as ghost) */}
        {phase !== PHASES.INTRO && phase !== PHASES.FINALE && (
          <button
            className="ctrl-btn ctrl-btn-ghost"
            onClick={resetGame}
            style={{ marginLeft: 'auto' }}
          >
            🔁 Reset
          </button>
        )}
      </div>
    </>
  );
}
