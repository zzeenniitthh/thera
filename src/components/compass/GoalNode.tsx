'use client';

import { Handle, Position } from '@xyflow/react';
import type { GoalNodeData } from '@/types/compass';

export function GoalNode({ data }: { data: GoalNodeData }) {
  return (
    <div className="relative flex items-center justify-center w-[140px] h-[140px]">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite 0.5s',
        }}
      />

      {/* Central orb */}
      <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.5),0_0_80px_rgba(255,255,255,0.2)]" />

      {/* Label */}
      <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-white/90 whitespace-nowrap max-w-[200px] truncate font-sans tracking-wide text-center">
        {data.label}
      </p>

      {/* Invisible handles */}
      <Handle type="source" position={Position.Top} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" id="bottom" />
      <Handle type="source" position={Position.Left} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" id="left" />
      <Handle type="source" position={Position.Right} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" id="right" />
    </div>
  );
}
