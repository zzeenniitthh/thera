import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExplorationSession } from '@/types/exploration';

interface ExplorationState {
  sessions: ExplorationSession[];
  activeSessionId: string | null;
  _hasHydrated: boolean;

  startSession: (directionId: string) => ExplorationSession;
  endSession: (id: string, notes?: string) => void;
  getActiveSession: () => ExplorationSession | undefined;
  getSessionsForDirection: (directionId: string) => ExplorationSession[];
  getAllSessions: () => ExplorationSession[];
  setHasHydrated: (val: boolean) => void;
}

export const useExplorationStore = create<ExplorationState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      _hasHydrated: false,

      startSession: (directionId) => {
        const session: ExplorationSession = {
          id: crypto.randomUUID(),
          directionId,
          startedAt: new Date().toISOString(),
          endedAt: null,
          durationMinutes: null,
          notes: '',
        };
        set((state) => ({
          sessions: [...state.sessions, session],
          activeSessionId: session.id,
        }));
        return session;
      },

      endSession: (id, notes) => {
        const now = new Date();
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== id) return s;
            const start = new Date(s.startedAt);
            const durationMinutes = Math.round((now.getTime() - start.getTime()) / 60000);
            return {
              ...s,
              endedAt: now.toISOString(),
              durationMinutes,
              notes: notes ?? s.notes,
            };
          }),
          activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
        }));
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId);
      },

      getSessionsForDirection: (directionId) =>
        get().sessions.filter((s) => s.directionId === directionId),

      getAllSessions: () =>
        [...get().sessions].sort(
          (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        ),

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'thera-exploration',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
