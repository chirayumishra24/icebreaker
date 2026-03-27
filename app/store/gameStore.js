import { create } from 'zustand';
import { PHASES } from '../lib/constants';

const useGameStore = create((set, get) => ({
  phase: PHASES.WELCOME,
  students: [],
  currentStudentIndex: -1,
  newStudentName: '',
  selectedAction: null,
  isReplaying: false,
  replayIndex: -1,
  celebrationActive: false,
  energyLevel: 0.2,

  // --- Phase transitions (wizard flow) ---

  goToSong: () => set({
    phase: PHASES.SONG,
    energyLevel: 0.3,
  }),

  goToAddStudent: () => set({
    phase: PHASES.ADD_STUDENT,
    newStudentName: '',
    selectedAction: null,
  }),

  setNewStudentName: (name) => set({ newStudentName: name }),
  setSelectedAction: (action) => set({ selectedAction: action }),

  // Add student → auto go to spotlight
  addStudent: () => {
    const { newStudentName, selectedAction, students } = get();
    if (!newStudentName.trim() || !selectedAction) return;

    const newStudent = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      action: selectedAction.id,
      icon: selectedAction.icon,
      label: selectedAction.label,
      color: selectedAction.color,
    };

    const newStudents = [...students, newStudent];
    set({
      students: newStudents,
      currentStudentIndex: newStudents.length - 1,
      phase: PHASES.SPOTLIGHT,
      newStudentName: '',
      selectedAction: null,
      energyLevel: Math.min(1, 0.3 + newStudents.length * 0.08),
    });
  },

  goToMemoryChain: () => set({
    phase: PHASES.MEMORY_CHAIN,
    isReplaying: false,
    replayIndex: -1,
  }),

  startReplay: () => set({ isReplaying: true, replayIndex: 0 }),

  advanceReplay: () => {
    const { replayIndex, students } = get();
    if (replayIndex < students.length - 1) {
      set({ replayIndex: replayIndex + 1 });
    } else {
      set({ isReplaying: false, replayIndex: -1 });
    }
  },

  goToFinale: () => set({
    phase: PHASES.FINALE,
    celebrationActive: true,
    energyLevel: 1,
    isReplaying: true,
    replayIndex: 0,
  }),

  resetGame: () => set({
    phase: PHASES.WELCOME,
    students: [],
    currentStudentIndex: -1,
    newStudentName: '',
    selectedAction: null,
    isReplaying: false,
    replayIndex: -1,
    celebrationActive: false,
    energyLevel: 0.2,
  }),
}));

export default useGameStore;
