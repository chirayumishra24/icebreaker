import { create } from 'zustand';
import { PHASES, APPRECIATIONS } from '../lib/constants';

const useGameStore = create((set, get) => ({
  phase: PHASES.WELCOME,
  students: [],
  currentStudentIndex: -1,
  appreciationIndex: 0,
  isReplaying: false,
  replayIndex: -1,
  celebrationActive: false,
  energyLevel: 0.2,

  // --- Phase transitions (wizard flow) ---

  goToSong: () => set({
    phase: PHASES.SONG,
    energyLevel: 0.3,
  }),

  goToAppreciation: () => set({
    phase: PHASES.ADD_STUDENT,
    appreciationIndex: 0,
  }),

  advanceAppreciation: () => {
    const { appreciationIndex } = get();
    if (appreciationIndex < APPRECIATIONS.length - 1) {
      set({ appreciationIndex: appreciationIndex + 1 });
    } else {
      // All 10 done — go to finale
      set({
        phase: PHASES.FINALE,
        celebrationActive: true,
        energyLevel: 1,
      });
    }
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
    appreciationIndex: 0,
    isReplaying: false,
    replayIndex: -1,
    celebrationActive: false,
    energyLevel: 0.2,
  }),
}));

export default useGameStore;
