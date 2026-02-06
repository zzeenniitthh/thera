'use client';

import { Handle, Position } from '@xyflow/react';
import type { DirectionNodeData } from '@/types/compass';

export function DirectionNode({ data }: { data: DirectionNodeData }) {
  const { label, status, glowIntensity } = data;

  const dotSize = 8 + glowIntensity * 8;
  const opacity = 0.4 + glowIntensity * 0.5;
  const blurRadius = 8 + glowIntensity * 32;
  const shadowOpacity = 0.05 + glowIntensity * 0.25;

  return (
    <div className="relative flex items-center justify-center w-[100px] h-[100px] cursor-pointer group">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${shadowOpacity}) 0%, transparent 70%)`,
          filter: `blur(${blurRadius}px)`,
        }}
      />

      {/* Exploring indicator ring */}
      {status === 'exploring' && (
        <div
          className="absolute inset-2 rounded-full border border-white/10"
          style={{
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Central dot */}
      <div
        className="rounded-full bg-white transition-all duration-700"
        style={{
          width: dotSize,
          height: dotSize,
          boxShadow: `0 0 ${blurRadius}px rgba(255,255,255,${shadowOpacity})`,
        }}
      />

      {/* Label */}
      <p
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap max-w-[120px] truncate font-sans tracking-wide text-center transition-opacity duration-500"
        style={{ opacity }}
      >
        {label}
      </p>

      {/* Status indicator */}
      {status === 'explored' && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/60" />
      )}

      {/* Invisible handles */}
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" />
      <Handle type="target" position={Position.Left} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" id="left" />
      <Handle type="source" position={Position.Right} className="!opacity-0 !w-0 !h-0 !border-0 !min-w-0 !min-h-0" id="right" />
    </div>
  );
}
