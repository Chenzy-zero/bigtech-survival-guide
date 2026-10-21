import { afterEach, describe, expect, it, vi } from 'vitest';
import { focusElementById, getProgressMetrics, MAX_STORY_STEPS } from '../src/ui/accessibility';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('accessible progress metrics', () => {
  it('starts at the first scene and exposes a matching percentage', () => {
    expect(getProgressMetrics(0)).toEqual({
      currentStep: 1,
      maxSteps: MAX_STORY_STEPS,
      percent: 8,
    });
  });

  it('advances one scene per recorded decision', () => {
    expect(getProgressMetrics(4)).toEqual({
      currentStep: 5,
      maxSteps: MAX_STORY_STEPS,
      percent: 42,
    });
  });

  it('caps progress at the maximum step', () => {
    expect(getProgressMetrics(99)).toEqual({
      currentStep: MAX_STORY_STEPS,
      maxSteps: MAX_STORY_STEPS,
      percent: 100,
    });
  });

  it('uses at least one step when given an invalid maximum', () => {
    expect(getProgressMetrics(0, 0)).toEqual({
      currentStep: 1,
      maxSteps: 1,
      percent: 100,
    });
  });
});

describe('focus management', () => {
  it('moves focus to the requested rendered element without scrolling', () => {
    const focus = vi.fn();
    const getElementById = vi.fn().mockReturnValue({ focus });
    vi.stubGlobal('document', { getElementById });

    focusElementById('scenario-title');

    expect(getElementById).toHaveBeenCalledWith('scenario-title');
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does nothing if the requested element is absent', () => {
    const getElementById = vi.fn().mockReturnValue(null);
    vi.stubGlobal('document', { getElementById });

    expect(() => focusElementById('ending-title')).not.toThrow();
  });
});
