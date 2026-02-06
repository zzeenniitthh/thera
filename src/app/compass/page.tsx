'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CompassMap } from '@/components/compass/CompassMap';
import { useGoalStore } from '@/stores/goalStore';
import { LANGUAGE } from '@/lib/constants';

export default function CompassPage() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const activeGoalId = useGoalStore((s) => s.activeGoalId);
  const hasHydrated = useGoalStore((s) => s._hasHydrated);

  const activeGoal = goals.find((g) => g.id === activeGoalId);

  useEffect(() => {
    if (hasHydrated) {
      if (goals.length === 0) {
        router.replace('/new-goal');
      } else {
        setIsReady(true);
      }
    }
  }, [hasHydrated, goals.length, router]);

  if (!isReady) {
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
