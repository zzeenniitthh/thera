import type { Node, Edge } from '@xyflow/react';
import type { DirectionStatus } from './direction';

export type GoalNodeData = {
  label: string;
  description: string;
  goalId: string;
};

export type DirectionNodeData = {
  label: string;
  description: string;
  directionId: string;
  status: DirectionStatus;
  depth: number;
  glowIntensity: number;
};

export type GoalNode = Node<GoalNodeData, 'goal'>;
export type DirectionNode = Node<DirectionNodeData, 'direction'>;
export type CompassNode = GoalNode | DirectionNode;

export type CosmicEdgeData = {
  animated?: boolean;
  glowIntensity?: number;
};

export type CosmicEdge = Edge<CosmicEdgeData>;
