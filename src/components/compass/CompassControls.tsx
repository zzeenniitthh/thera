'use client';

import { useState, useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useDirectionStore } from '@/stores/directionStore';
import { useGoalStore } from '@/stores/goalStore';
import { useUIStore } from '@/stores/uiStore';
import { LANGUAGE } from '@/lib/constants';

export function CompassControls({ goalId }: { goalId: string }) {
  const { fitView } = useReactFlow();
  const isGenerating = useUIStore((s) => s.isGenerating);
  const setGenerating = useUIStore((s) => s.setGenerating);
  const addDirections = useDirectionStore((s) => s.addDirections);
  const goals = useGoalStore((s) => s.goals);
  const allDirections = useDirectionStore((s) => s.directions);

  const goal = useMemo(() => goals.find((g) => g.id === goalId), [goals, goalId]);
  const directions = useMemo(() =>
    allDirections.filter((d) => d.goalId === goalId),
    [allDirections, goalId]
  );

  const [showManual, setShowManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');

  const handleGenerate = async () => {
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
        }),
      });

      if (!res.ok) throw new Error('Failed to generate');

      const data = await res.json();
      const newDirections = data.directions.map(
        (d: { title: string; description: string }) => ({
          goalId: goal.id,
          parentId: null,
          title: d.title,
          description: d.description,
          status: 'undiscovered' as const,
          notes: '',
          position: { x: 0, y: 0 },
          depth: 0,
        })
      );

      addDirections(newDirections);

      setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 200);
    } catch {
      // Silently fail for now - could add toast
    } finally {
      setGenerating(false);
    }
  };

  const handleAddManual = () => {
    if (!manualTitle.trim()) return;
    addDirections([
      {
        goalId,
        parentId: null,
        title: manualTitle.trim(),
        description: manualDesc.trim(),
        status: 'undiscovered',
        notes: '',
        position: { x: 0, y: 0 },
        depth: 0,
      },
    ]);
    setManualTitle('');
    setManualDesc('');
    setShowManual(false);
    setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 200);
  };

  return (
    <>
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        {directions.length === 0 && (
          <Button variant="cosmic" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? LANGUAGE.goalCreation.generating : LANGUAGE.compass.generateButton}
          </Button>
        )}
        <Button variant="ghost" onClick={() => setShowManual(true)}>
          {LANGUAGE.compass.addManual}
        </Button>
        <Button
          variant="ghost"
          onClick={() => fitView({ padding: 0.3, duration: 800 })}
        >
          {LANGUAGE.compass.centerButton}
        </Button>
      </div>

      {/* Generate button for when directions already exist */}
      {directions.length > 0 && (
        <div className="absolute top-6 right-6 z-20">
          <Button variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? LANGUAGE.goalCreation.generating : '+ Discover more'}
          </Button>
        </div>
      )}

      <Modal isOpen={showManual} onClose={() => setShowManual(false)}>
        <h3 className="text-lg font-sans mb-4 text-white">Add a direction</h3>
        <input
          type="text"
          value={manualTitle}
          onChange={(e) => setManualTitle(e.target.value)}
          placeholder="Name this direction..."
          className="w-full bg-thera-dark-900 border border-thera-dark-600 rounded-lg px-4 py-3 text-sm text-white placeholder:text-thera-gray-400 focus:outline-none focus:border-thera-gray-400 transition-colors mb-3"
          autoFocus
        />
        <textarea
          value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
          placeholder="Why does this direction interest you?"
          className="w-full bg-thera-dark-900 border border-thera-dark-600 rounded-lg px-4 py-3 text-sm text-white placeholder:text-thera-gray-400 focus:outline-none focus:border-thera-gray-400 transition-colors resize-none h-20 mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setShowManual(false)}>
            Not now
          </Button>
          <Button variant="cosmic" onClick={handleAddManual} disabled={!manualTitle.trim()}>
            Add direction
          </Button>
        </div>
      </Modal>
    </>
  );
}
