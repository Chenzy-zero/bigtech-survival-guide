import { describe, expect, it } from 'vitest';
import { events, START_EVENT_ID } from '../src/data/events';
import { chooseOption, getAvailableChoices, getCurrentEvent, startGame } from '../src/engine/game';
import { validateEvents } from '../src/engine/validate-events';

function pick(state: ReturnType<typeof startGame>, choiceId: string) {
  return chooseOption(events, state, choiceId);
}

function playToSurvivalEnding() {
  let state = startGame(START_EVENT_ID);
  state = pick(state, 'resume-truth');
  state = pick(state, 'interview-ask');
  state = pick(state, 'offer-verify');
  state = pick(state, 'name-ask');
  state = pick(state, 'team-boundary');
  state = pick(state, 'probation-clarify');
  state = pick(state, 'urgent-fix');
  expect(getAvailableChoices(getCurrentEvent(events, state), state).map((choice) => choice.id)).toContain('outage-evidence');
  state = pick(state, 'outage-evidence');
  state = pick(state, 'retro-evidence');
  return state;
}

describe('event data validation', () => {
  it('accepts the production story graph', () => {
    expect(validateEvents(events, START_EVENT_ID)).toEqual([]);
  });

  it('reports duplicate ids and missing transition targets', () => {
    const broken = [
      { id: 'start', chapter: 'test', title: 'start', body: 'body', choices: [
        { id: 'a', text: 'A', feedback: 'feedback', nextEventId: 'missing' },
        { id: 'a', text: 'B', feedback: 'feedback', nextEventId: 'start' },
      ] },
      { id: 'start', chapter: 'test', title: 'duplicate', body: 'body', ending: {
        outcome: 'won' as const, label: 'won', title: 'won', body: 'body', explanation: 'why',
      } },
    ];
    const errors = validateEvents(broken, 'start');
    expect(errors.some((error) => error.includes('Duplicate event id: start'))).toBe(true);
    expect(errors.some((error) => error.includes('points to missing event missing'))).toBe(true);
  });
});

describe('game flow', () => {
  it('starts at the resume event with a clean run', () => {
    const state = startGame(START_EVENT_ID);
    expect(state.currentEventId).toBe('resume-001');
    expect(state.decisions).toHaveLength(0);
    expect(state.flags).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('allows a player who documents the risk to reach a survival ending', () => {
    const state = playToSurvivalEnding();
    const ending = getCurrentEvent(events, state);
    expect(ending.id).toBe('ending-survivor');
    expect(state.status).toBe('won');
    expect(state.flags).toContain('kept_evidence');
    expect(state.decisions).toHaveLength(9);
  });

  it('lets performative busyness reach a satirical promotion ending', () => {
    let state = startGame();
    state = pick(state, 'resume-polish');
    state = pick(state, 'interview-praise');
    state = pick(state, 'offer-sign');
    state = pick(state, 'name-pick');
    state = pick(state, 'team-praise');
    state = pick(state, 'probation-promise');
    state = pick(state, 'urgent-report');
    state = pick(state, 'outage-busy');
    state = pick(state, 'retro-busy');

    expect(getCurrentEvent(events, state).id).toBe('ending-promoted');
    expect(state.status).toBe('won');
    expect(state.flags).toContain('performed_busy');
  });

  it('does not allow a conditional choice when its clue flag is absent', () => {
    const state = startGame();
    const event = events.find((candidate) => candidate.id === 'outage-008');
    expect(event).toBeDefined();
    expect(() => chooseOption(events, { ...state, currentEventId: 'outage-008' }, 'outage-evidence')).toThrow(/not available/);
  });

  it('rejects choices after the run has ended', () => {
    const state = playToSurvivalEnding();
    expect(() => chooseOption(events, state, 'anything')).toThrow(/already ended/);
  });

  it('restart clears prior decisions and flags', () => {
    const previous = playToSurvivalEnding();
    expect(previous.decisions.length).toBeGreaterThan(0);
    const restarted = startGame(START_EVENT_ID);
    expect(restarted.decisions).toEqual([]);
    expect(restarted.flags).toEqual([]);
    expect(restarted.currentEventId).toBe(START_EVENT_ID);
  });
});
