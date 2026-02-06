'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGoalStore } from '@/stores/goalStore';
import { LANGUAGE } from '@/lib/constants';

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const hasHydrated = useGoalStore((s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      if (goals.length > 0) {
        router.replace('/compass');
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

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl font-mono font-light tracking-[0.3em] text-white mb-4"
        >
          THERA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-thera-gray-300 font-sans text-lg mb-2"
        >
          {LANGUAGE.home.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-thera-gray-400 font-sans text-sm mb-12"
        >
          {LANGUAGE.home.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Button
            variant="cosmic"
            onClick={() => router.push('/new-goal')}
            className="text-base px-10 py-3 tracking-widest"
          >
            {LANGUAGE.home.begin}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
