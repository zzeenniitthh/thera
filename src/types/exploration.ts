export interface ExplorationSession {
  id: string;
  directionId: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  notes: string;
}
