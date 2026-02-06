import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal } from '@/types/goal';

interface GoalState {
  goals: Goal[];
  activeGoalId: string | null;
  _hasHydrated: boolean;

  addGoal: (title: string, description: string) => Goal;
  setActiveGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  getActiveGoal: () => Goal | undefined;
  setHasHydrated: (val: boolean) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      activeGoalId: null,
      _hasHydrated: false,

      addGoal: (title, description) => {
        const goal: Goal = {
          id: crypto.randomUUID(),
          title,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          goals: [...state.goals, goal],
          activeGoalId: goal.id,
        }));
        return goal;
      },

      setActiveGoal: (id) => set({ activeGoalId: id }),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
          activeGoalId: state.activeGoalId === id ? null : state.activeGoalId,
        })),

      getActiveGoal: () => {
        const { goals, activeGoalId } = get();
        return goals.find((g) => g.id === activeGoalId);
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'thera-goals',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
