'use client';

import { BaseEdge, getBezierPath } from '@xyflow/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CosmicEdge(props: any) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const intensity = data?.glowIntensity ?? 0;
  const isAnimated = data?.animated ?? false;
  const strokeOpacity = 0.06 + intensity * 0.14;

  return (
    <>
      <defs>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `rgba(255, 255, 255, ${strokeOpacity})`,
          strokeWidth: 1 + intensity * 0.5,
          filter: intensity > 0.3 ? `url(#glow-${id})` : undefined,
          strokeDasharray: isAnimated ? '6 4' : undefined,
          animation: isAnimated ? 'dash 1.5s linear infinite' : undefined,
        }}
      />
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </>
  );
}
