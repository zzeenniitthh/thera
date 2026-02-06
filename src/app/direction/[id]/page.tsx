'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea } from '@/components/ui/TextArea';
import { useDirectionStore } from '@/stores/directionStore';
import { useGoalStore } from '@/stores/goalStore';
import { useUIStore } from '@/stores/uiStore';
import { useExplorationStore } from '@/stores/explorationStore';
import { LANGUAGE } from '@/lib/constants';
import { PageTransition } from '@/components/layout/PageTransition';

export default function DirectionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const allDirections = useDirectionStore((s) => s.directions);
  const setStatus = useDirectionStore((s) => s.setDirectionStatus);
  const updateNotes = useDirectionStore((s) => s.updateNotes);
  const addDirections = useDirectionStore((s) => s.addDirections);
  const hasHydrated = useDirectionStore((s) => s._hasHydrated);

  const goals = useGoalStore((s) => s.goals);
  const allSessions = useExplorationStore((s) => s.sessions);
  const isGenerating = useUIStore((s) => s.isGenerating);
  const setGenerating = useUIStore((s) => s.setGenerating);

  const direction = useMemo(() =>
    allDirections.find((d) => d.id === params.id),
    [allDirections, params.id]
  );

  const children = useMemo(() =>
    direction ? allDirections.filter((d) => d.parentId === direction.id && d.goalId === direction.goalId) : [],
    [direction, allDirections]
  );

  const goal = useMemo(() =>
    direction ? goals.find((g) => g.id === direction.goalId) : undefined,
    [direction, goals]
  );

  const sessions = useMemo(() =>
    direction ? allSessions.filter((s) => s.directionId === direction.id) : [],
    [direction, allSessions]
  );

  if (!hasHydrated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse-glow" />
      </div>
    );
  }

  if (!direction) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-thera-gray-400 font-mono text-sm">This direction seems to have drifted away.</p>
      </div>
    );
  }

  const glowIntensity = direction.status === 'explored' ? 1 : direction.status === 'exploring' ? 0.5 : 0;

  const handleGenerateSubDirections = async () => {
    if (!goal || isGenerating) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/generate-directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: goal.id,
          goalTitle: goal.title,
          goalDescription: goal.description,
          parentDirectionTitle: direction.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        addDirections(
          data.directions.map((d: { title: string; description: string }) => ({
            goalId: direction.goalId,
            parentId: direction.id,
            title: d.title,
            description: d.description,
            status: 'undiscovered' as const,
            notes: '',
            position: { x: 0, y: 0 },
            depth: direction.depth + 1,
          }))
        );
      }
    } catch {
      // Silently handle
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = () => {
    if (direction.status === 'undiscovered') {
      setStatus(direction.id, 'exploring');
    } else if (direction.status === 'exploring') {
      setStatus(direction.id, 'explored');
    } else {
      setStatus(direction.id, 'exploring');
    }
  };

  const statusButtonLabel =
    direction.status === 'undiscovered'
      ? LANGUAGE.direction.beginExploring
      : direction.status === 'exploring'
        ? LANGUAGE.direction.markExplored
        : LANGUAGE.direction.revisit;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back to compass */}
        <motion.button
          onClick={() => router.push('/compass')}
          className="text-thera-gray-400 hover:text-white text-sm font-mono tracking-wide mb-8 flex items-center gap-2 transition-colors cursor-pointer"
          whileHover={{ x: -4 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to compass
        </motion.button>

        {/* Direction title with glow */}
        <div className="relative mb-8">
          <div
            className="absolute -inset-4 rounded-full opacity-30 blur-3xl transition-all duration-700"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,${glowIntensity * 0.2}) 0%, transparent 70%)`,
            }}
          />
          <h1 className="text-3xl font-sans font-light text-white relative">{direction.title}</h1>
          <p className="text-xs font-mono text-thera-gray-400 mt-2 tracking-wide uppercase relative">
            {LANGUAGE.status[direction.status]}
          </p>
        </div>

        {/* Why this connects */}
        {direction.description && (
          <Card className="mb-6">
            <h3 className="text-xs font-mono text-thera-gray-400 tracking-wide uppercase mb-2">
              {LANGUAGE.direction.whyConnects}
            </h3>
            <p className="text-thera-gray-200 font-sans text-sm leading-relaxed">
              {direction.description}
            </p>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <Button variant="cosmic" onClick={handleStatusChange}>
            {statusButtonLabel}
          </Button>
          <Button variant="primary" onClick={() => router.push(`/explore/${direction.id}`)}>
            Enter focused exploration
          </Button>
        </div>

        {/* Sub-directions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-thera-gray-300 tracking-wide">
              Possibilities from here
            </h3>
            <Button
              variant="ghost"
              onClick={handleGenerateSubDirections}
              disabled={isGenerating}
              className="text-xs"
            >
              {isGenerating ? 'Discovering...' : LANGUAGE.direction.generateSub}
            </Button>
          </div>

          {children.length > 0 ? (
            <div className="space-y-2">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  whileHover={{ x: 4 }}
                  onClick={() => router.push(`/direction/${child.id}`)}
                  className="cursor-pointer"
                >
                  <Card
                    glow={child.status === 'explored'}
                    className="flex items-center gap-3 !py-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full bg-white flex-shrink-0 transition-all duration-500"
                      style={{
                        opacity: child.status === 'explored' ? 0.9 : child.status === 'exploring' ? 0.5 : 0.2,
                        boxShadow: child.status !== 'undiscovered'
                          ? '0 0 8px rgba(255,255,255,0.3)'
                          : 'none',
                      }}
                    />
                    <div>
                      <p className="text-sm text-white">{child.title}</p>
                      <p className="text-xs text-thera-gray-400 mt-0.5">
                        {LANGUAGE.status[child.status]}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-thera-gray-400 text-xs font-mono">
              No paths discovered yet. What possibilities might branch from here?
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className="text-sm font-mono text-thera-gray-300 tracking-wide mb-3">
            Your notes
          </h3>
          <TextArea
            value={direction.notes}
            onChange={(e) => updateNotes(direction.id, e.target.value)}
            placeholder={LANGUAGE.direction.notesPlaceholder}
          />
        </div>

        {/* Past exploration sessions */}
        {sessions.length > 0 && (
          <div>
            <h3 className="text-sm font-mono text-thera-gray-300 tracking-wide mb-3">
              Past explorations
            </h3>
            <div className="space-y-2">
              {sessions.map((session) => (
                <Card key={session.id} className="!py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-thera-gray-400 font-mono">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </span>
                    {session.durationMinutes !== null && (
                      <span className="text-xs text-thera-gray-400 font-mono">
                        {session.durationMinutes} min
                      </span>
                    )}
                  </div>
                  {session.notes && (
                    <p className="text-xs text-thera-gray-200 mt-1 line-clamp-2">
                      {session.notes}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
