export type DirectionStatus = 'undiscovered' | 'exploring' | 'explored';

export interface Direction {
  id: string;
  goalId: string;
  parentId: string | null;
  title: string;
  description: string;
  status: DirectionStatus;
  notes: string;
  position: { x: number; y: number };
  depth: number;
  createdAt: string;
  updatedAt: string;
}
