'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { useExplorationStore } from '@/stores/explorationStore';
import { useDirectionStore } from '@/stores/directionStore';
import { useGoalStore } from '@/stores/goalStore';
import { useHydration } from '@/hooks/useHydration';
import { LANGUAGE } from '@/lib/constants';
import { PageTransition } from '@/components/layout/PageTransition';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

export default function JourneyPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const sessions = useExplorationStore((s) => s.getAllSessions());
  const getDirection = useDirectionStore((s) => s.getDirection);
  const goals = useGoalStore((s) => s.goals);

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse-glow" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-sans font-light text-white mb-2">
          {LANGUAGE.journey.heading}
        </h1>
        <p className="text-xs font-mono text-thera-gray-400 tracking-wide mb-8">
          {sessions.length === 0
            ? LANGUAGE.journey.emptyState
            : `${sessions.length} exploration${sessions.length !== 1 ? 's' : ''}`}
        </p>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-3 h-3 rounded-full bg-white/20 mb-4" />
            <p className="text-thera-gray-400 font-sans text-sm text-center">
              {LANGUAGE.journey.emptyState}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-4">
              {sessions.map((session, i) => {
                const direction = getDirection(session.directionId);
                if (!direction) return null;

                const goal = goals.find((g) => g.id === direction.goalId);
                const glowIntensity = direction.status === 'explored' ? 0.9 : direction.status === 'exploring' ? 0.5 : 0.2;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="relative pl-10 cursor-pointer"
                    onClick={() => router.push(`/direction/${direction.id}`)}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-1.5 top-4 w-3 h-3 rounded-full bg-white transition-all duration-500"
                      style={{
                        opacity: glowIntensity,
                        boxShadow: `0 0 ${8 + glowIntensity * 12}px rgba(255,255,255,${glowIntensity * 0.4})`,
                      }}
                    />

                    <Card className="hover:border-thera-dark-500 transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm text-white font-sans">{direction.title}</h3>
                        <span className="text-xs text-thera-gray-400 font-mono flex-shrink-0 ml-4">
                          {timeAgo(session.startedAt)}
                        </span>
                      </div>

                      {goal && (
                        <p className="text-xs text-thera-gray-400 font-mono mb-2">
                          {goal.title}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-thera-gray-400 font-mono">
                        {session.durationMinutes !== null && (
                          <span>{session.durationMinutes} min</span>
                        )}
                        <span className="uppercase tracking-wider">
                          {LANGUAGE.status[direction.status]}
                        </span>
                      </div>

                      {session.notes && (
                        <p className="text-xs text-thera-gray-200 mt-2 line-clamp-2">
                          {session.notes}
                        </p>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
