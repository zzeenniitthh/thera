'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { useDirectionStore } from '@/stores/directionStore';
import { useExplorationStore } from '@/stores/explorationStore';
import { LANGUAGE } from '@/lib/constants';

export default function ExplorationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const allDirections = useDirectionStore((s) => s.directions);
  const setStatus = useDirectionStore((s) => s.setDirectionStatus);
  const updateDirectionNotes = useDirectionStore((s) => s.updateNotes);
  const hasHydrated = useDirectionStore((s) => s._hasHydrated);

  const startSession = useExplorationStore((s) => s.startSession);
  const endSession = useExplorationStore((s) => s.endSession);

  const direction = useMemo(() =>
    allDirections.find((d) => d.id === params.id),
    [allDirections, params.id]
  );

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  // Start session on mount
  useEffect(() => {
    if (hasHydrated && direction && !sessionId) {
      const session = startSession(direction.id);
      setSessionId(session.id);
      startTimeRef.current = Date.now();

      if (direction.status === 'undiscovered') {
        setStatus(direction.id, 'exploring');
      }
    }
  }, [hasHydrated, direction, sessionId, startSession, setStatus]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startTimeRef.current) / 60000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleWrapUp = useCallback(() => {
    if (sessionId) {
      endSession(sessionId, notes);
    }
    if (direction && notes) {
      const existingNotes = direction.notes;
      const combined = existingNotes
        ? `${existingNotes}\n\n---\n\n${notes}`
        : notes;
      updateDirectionNotes(direction.id, combined);
    }
    router.push('/compass');
  }, [sessionId, notes, direction, endSession, updateDirectionNotes, router]);

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

  return (
    <div className="min-h-screen relative">
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-30 max-w-xl mx-auto px-6 py-16 flex flex-col items-center min-h-screen"
      >
        {/* Direction title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-sans font-light text-white text-center mb-2"
        >
          {direction.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xs font-mono text-thera-gray-400 tracking-wide mb-12"
        >
          Focused exploration
        </motion.p>

        {/* Timer */}
        {showTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-8 cursor-pointer"
            onClick={() => setShowTimer(false)}
          >
            <p className="text-xs font-mono text-thera-gray-400 text-center">
              {LANGUAGE.exploration.timeSpent(elapsedMinutes)}
            </p>
          </motion.div>
        )}

        {/* Notes area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full flex-1 mb-8"
        >
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={LANGUAGE.exploration.notePrompt}
            className="min-h-[300px] bg-transparent border-thera-dark-700 focus:border-thera-dark-500"
            autoFocus
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex gap-3"
        >
          <Button variant="cosmic" onClick={handleWrapUp}>
            {LANGUAGE.exploration.wrapUp}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
