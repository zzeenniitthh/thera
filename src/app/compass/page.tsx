'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CompassMap } from '@/components/compass/CompassMap';
import { useGoalStore } from '@/stores/goalStore';
import { useHydration } from '@/hooks/useHydration';
import { LANGUAGE } from '@/lib/constants';

export default function CompassPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const activeGoal = useGoalStore((s) => s.getActiveGoal());
  const hasGoals = useGoalStore((s) => s.goals.length > 0);

  useEffect(() => {
    if (hydrated && !hasGoals) {
      router.replace('/new-goal');
    }
  }, [hydrated, hasGoals, router]);

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse-glow" />
      </div>
    );
  }

  if (!activeGoal) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-thera-gray-400 font-mono text-sm">
          {LANGUAGE.compass.emptyState}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <CompassMap />
    </div>
  );
}
