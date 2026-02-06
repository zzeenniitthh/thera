'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useGoalStore } from '@/stores/goalStore';
import { useDirectionStore } from '@/stores/directionStore';
import { useUIStore } from '@/stores/uiStore';
import { LANGUAGE } from '@/lib/constants';

export default function NewGoalPage() {
  const router = useRouter();
  const addGoal = useGoalStore((s) => s.addGoal);
  const addDirections = useDirectionStore((s) => s.addDirections);
  const setGenerating = useUIStore((s) => s.setGenerating);
  const isGenerating = useUIStore((s) => s.isGenerating);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const goal = addGoal(title.trim(), description.trim());
    setGenerating(true);

    try {
      const res = await fetch('/api/generate-directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: goal.id,
          goalTitle: goal.title,
          goalDescription: goal.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        addDirections(
          data.directions.map((d: { title: string; description: string }) => ({
            goalId: goal.id,
            parentId: null,
            title: d.title,
            description: d.description,
            status: 'undiscovered' as const,
            notes: '',
            position: { x: 0, y: 0 },
            depth: 0,
          }))
        );
      }
    } catch {
      // Continue to compass even if AI fails
    } finally {
      setGenerating(false);
    }

    router.push('/compass');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-2xl font-sans font-light text-white mb-8 text-center"
        >
          {LANGUAGE.goalCreation.heading}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={LANGUAGE.goalCreation.titlePlaceholder}
            className="w-full bg-transparent border-b border-thera-dark-500 px-2 py-4 text-xl text-white placeholder:text-thera-gray-400 focus:outline-none focus:border-thera-gray-300 transition-colors duration-300 font-sans"
            autoFocus
          />

          <p className="text-xs text-thera-gray-400 font-mono tracking-wide pt-2">
            {LANGUAGE.goalCreation.descriptionPrompt}
          </p>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={LANGUAGE.goalCreation.descriptionPlaceholder}
            className="w-full bg-thera-dark-900/50 border border-thera-dark-600 rounded-lg px-4 py-3 text-sm text-thera-gray-100 placeholder:text-thera-gray-400 focus:outline-none focus:border-thera-gray-400 transition-colors duration-300 resize-none h-24 font-sans"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button
            variant="cosmic"
            onClick={handleSubmit}
            disabled={!title.trim() || isGenerating}
            className="text-base px-8 py-3"
          >
            {isGenerating ? LANGUAGE.goalCreation.generating : LANGUAGE.goalCreation.submit}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
