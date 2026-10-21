export const MAX_STORY_STEPS = 12;

export interface ProgressMetrics {
  currentStep: number;
  maxSteps: number;
  percent: number;
}

export function getProgressMetrics(decisionCount: number, maxSteps = MAX_STORY_STEPS): ProgressMetrics {
  const total = Math.max(1, Math.floor(maxSteps));
  const currentStep = Math.min(total, Math.max(1, Math.floor(decisionCount) + 1));
  return {
    currentStep,
    maxSteps: total,
    percent: Math.round((currentStep / total) * 100),
  };
}

export type FocusTarget = 'scenario-title' | 'ending-title' | 'start-game';

export function focusElementById(id: FocusTarget): void {
  document.getElementById(id)?.focus({ preventScroll: true });
}
