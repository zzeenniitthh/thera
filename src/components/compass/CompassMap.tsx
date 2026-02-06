'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { useGoalStore } from '@/stores/goalStore';
import { useDirectionStore } from '@/stores/directionStore';
import { computeCosmicLayout } from '@/lib/cosmicLayout';
import { GoalNode } from './GoalNode';
import { DirectionNode } from './DirectionNode';
import { CosmicEdge } from './CosmicEdge';
import { CompassControls } from './CompassControls';
import type { CompassNode as CompassNodeType, CosmicEdge as CosmicEdgeType } from '@/types/compass';

const nodeTypes = {
  goal: GoalNode,
  direction: DirectionNode,
};

const edgeTypes = {
  cosmic: CosmicEdge,
};

function CompassMapInner() {
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const activeGoalId = useGoalStore((s) => s.activeGoalId);
  const allDirections = useDirectionStore((s) => s.directions);
  const updateDirection = useDirectionStore((s) => s.updateDirection);
  const { fitView } = useReactFlow();
  const [initialized, setInitialized] = useState(false);

  const goal = useMemo(() => goals.find((g) => g.id === activeGoalId), [goals, activeGoalId]);
  const directions = useMemo(() =>
    goal ? allDirections.filter((d) => d.goalId === goal.id) : [],
    [goal, allDirections]
  );

  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    if (!goal) return { nodes: [] as CompassNodeType[], edges: [] as CosmicEdgeType[] };
    return computeCosmicLayout(goal, directions);
  }, [goal, directions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  // Sync layout changes
  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  // Fit view on first render with nodes
  useEffect(() => {
    if (!initialized && nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.3, duration: 800 });
        setInitialized(true);
      }, 100);
    }
  }, [nodes.length, initialized, fitView]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.type === 'direction') {
        const dirId = (node.data as { directionId: string }).directionId;
        router.push(`/direction/${dirId}`);
      }
    },
    [router]
  );

  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.type === 'direction') {
        const dirId = (node.data as { directionId: string }).directionId;
        updateDirection(dirId, {
          position: { x: node.position.x, y: node.position.y },
        });
      }
    },
    [updateDirection]
  );

  if (!goal) return null;

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'cosmic' }}
      >
        <Background
          color="rgba(255,255,255,0.03)"
          gap={40}
          size={1}
        />
      </ReactFlow>
      <CompassControls goalId={goal.id} />
    </div>
  );
}

export function CompassMap() {
  return (
    <ReactFlowProvider>
      <CompassMapInner />
    </ReactFlowProvider>
  );
}
