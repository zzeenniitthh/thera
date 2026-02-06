import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Direction, DirectionStatus } from '@/types/direction';

interface DirectionState {
  directions: Direction[];
  _hasHydrated: boolean;

  addDirection: (direction: Omit<Direction, 'id' | 'createdAt' | 'updatedAt'>) => Direction;
  addDirections: (directions: Omit<Direction, 'id' | 'createdAt' | 'updatedAt'>[]) => Direction[];
  updateDirection: (id: string, updates: Partial<Direction>) => void;
  setDirectionStatus: (id: string, status: DirectionStatus) => void;
  updateNotes: (id: string, notes: string) => void;
  getDirectionsForGoal: (goalId: string) => Direction[];
  getDirectionsByParent: (parentId: string | null, goalId: string) => Direction[];
  getDirection: (id: string) => Direction | undefined;
  removeDirectionsForGoal: (goalId: string) => void;
  setHasHydrated: (val: boolean) => void;
}

export const useDirectionStore = create<DirectionState>()(
  persist(
    (set, get) => ({
      directions: [],
      _hasHydrated: false,

      addDirection: (data) => {
        const now = new Date().toISOString();
        const direction: Direction = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ directions: [...state.directions, direction] }));
        return direction;
      },

      addDirections: (items) => {
        const now = new Date().toISOString();
        const newDirections = items.map((data) => ({
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        }));
        set((state) => ({ directions: [...state.directions, ...newDirections] }));
        return newDirections;
      },

      updateDirection: (id, updates) =>
        set((state) => ({
          directions: state.directions.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        })),

      setDirectionStatus: (id, status) =>
        set((state) => ({
          directions: state.directions.map((d) =>
            d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
          ),
        })),

      updateNotes: (id, notes) =>
        set((state) => ({
          directions: state.directions.map((d) =>
            d.id === id ? { ...d, notes, updatedAt: new Date().toISOString() } : d
          ),
        })),

      getDirectionsForGoal: (goalId) =>
        get().directions.filter((d) => d.goalId === goalId),

      getDirectionsByParent: (parentId, goalId) =>
        get().directions.filter((d) => d.goalId === goalId && d.parentId === parentId),

      getDirection: (id) => get().directions.find((d) => d.id === id),

      removeDirectionsForGoal: (goalId) =>
        set((state) => ({
          directions: state.directions.filter((d) => d.goalId !== goalId),
        })),

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'thera-directions',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
