import type { Goal } from '@/types/goal';
import type { Direction } from '@/types/direction';
import type { CompassNode, CosmicEdge, GoalNodeData, DirectionNodeData } from '@/types/compass';

function glowForStatus(status: Direction['status']): number {
  switch (status) {
    case 'undiscovered':
      return 0;
    case 'exploring':
      return 0.5;
    case 'explored':
      return 1;
  }
}

export function computeCosmicLayout(
  goal: Goal,
  directions: Direction[]
): { nodes: CompassNode[]; edges: CosmicEdge[] } {
  const nodes: CompassNode[] = [];
  const edges: CosmicEdge[] = [];

  // Goal node at center
  const goalNode: CompassNode = {
    id: `goal-${goal.id}`,
    type: 'goal',
    position: { x: 0, y: 0 },
    data: {
      label: goal.title,
      description: goal.description,
      goalId: goal.id,
    } as GoalNodeData,
    draggable: false,
  };
  nodes.push(goalNode);

  // Group directions by parent
  const topLevel = directions.filter((d) => d.parentId === null);
  const byParent = new Map<string, Direction[]>();
  for (const d of directions) {
    if (d.parentId) {
      const existing = byParent.get(d.parentId) || [];
      existing.push(d);
      byParent.set(d.parentId, existing);
    }
  }

  // Place top-level directions in an orbital ring
  const baseRadius = 300;
  const angleStep = topLevel.length > 0 ? (2 * Math.PI) / topLevel.length : 0;
  // Start at top (-PI/2) for first node
  const startAngle = -Math.PI / 2;

  topLevel.forEach((dir, i) => {
    const angle = startAngle + i * angleStep;
    // Use saved position if available, otherwise compute
    const hasPosition = dir.position.x !== 0 || dir.position.y !== 0;
    const jitterX = (Math.sin(i * 137.5) * 20); // deterministic jitter
    const jitterY = (Math.cos(i * 137.5) * 20);
    const x = hasPosition ? dir.position.x : Math.cos(angle) * baseRadius + jitterX;
    const y = hasPosition ? dir.position.y : Math.sin(angle) * baseRadius + jitterY;

    const dirNode: CompassNode = {
      id: `direction-${dir.id}`,
      type: 'direction',
      position: { x, y },
      data: {
        label: dir.title,
        description: dir.description,
        directionId: dir.id,
        status: dir.status,
        depth: dir.depth,
        glowIntensity: glowForStatus(dir.status),
      } as DirectionNodeData,
    };
    nodes.push(dirNode);

    // Edge from goal to this direction
    edges.push({
      id: `edge-goal-${dir.id}`,
      source: `goal-${goal.id}`,
      target: `direction-${dir.id}`,
      type: 'cosmic',
      data: {
        animated: dir.status === 'exploring',
        glowIntensity: glowForStatus(dir.status),
      },
    });

    // Place sub-directions around this parent
    const children = byParent.get(dir.id) || [];
    const subRadius = 150;
    const subAngleStep = children.length > 0 ? (2 * Math.PI) / children.length : 0;

    children.forEach((child, j) => {
      const subAngle = angle + (j - (children.length - 1) / 2) * (Math.PI / 4);
      const hasSubPos = child.position.x !== 0 || child.position.y !== 0;
      const cx = hasSubPos ? child.position.x : x + Math.cos(subAngle) * subRadius;
      const cy = hasSubPos ? child.position.y : y + Math.sin(subAngle) * subRadius;

      const childNode: CompassNode = {
        id: `direction-${child.id}`,
        type: 'direction',
        position: { x: cx, y: cy },
        data: {
          label: child.title,
          description: child.description,
          directionId: child.id,
          status: child.status,
          depth: child.depth,
          glowIntensity: glowForStatus(child.status),
        } as DirectionNodeData,
      };
      nodes.push(childNode);

      edges.push({
        id: `edge-${dir.id}-${child.id}`,
        source: `direction-${dir.id}`,
        target: `direction-${child.id}`,
        type: 'cosmic',
        data: {
          animated: child.status === 'exploring',
          glowIntensity: glowForStatus(child.status),
        },
      });
    });
  });

  return { nodes, edges };
}
