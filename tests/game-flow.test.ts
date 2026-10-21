import { describe, expect, it } from 'vitest';
import { events, START_EVENT_ID } from '../src/data/events';
import { chooseOption, getAvailableChoices, getCurrentEvent, startGame } from '../src/engine/game';
import { validateEvents } from '../src/engine/validate-events';

function pick(state: ReturnType<typeof startGame>, choiceId: string) {
  return chooseOption(events, state, choiceId);
}

function play(choiceIds: string[]) {
  return choiceIds.reduce((state, choiceId) => pick(state, choiceId), startGame(START_EVENT_ID));
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

  it('keeps scene prompts short, concrete, and free of separate clue cards', () => {
    const scenes = events.filter((event) => !event.ending);
    expect(scenes.length).toBeGreaterThanOrEqual(10);
    expect(scenes.every((event) => event.body.length <= 100)).toBe(true);
    expect(scenes.every((event) => !('clue' in event))).toBe(true);
    expect(events.some((event) => [event.title, event.body, ...(event.choices ?? []).map((choice) => choice.text)].some((text) => text.includes('主人翁精神')))).toBe(false);
  });
});

describe('instant failure by stage', () => {
  const failPaths: Array<{ name: string; choices: string[]; endingId: string }> = [
    { name: '简历夸大项目', choices: ['resume-bluff'], endingId: 'ending-resume-bluff' },
    { name: '面试夸大贡献', choices: ['resume-specific', 'interview-claim'], endingId: 'ending-interview-claim' },
    { name: '编造项目数据', choices: ['resume-specific', 'interview-specific', 'followup-fake-metric'], endingId: 'ending-metric-fake' },
    { name: '薪资不问清楚', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-anything'], endingId: 'ending-salary-low' },
    { name: '口头 Offer 后先辞职', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-resign'], endingId: 'ending-offer-cancelled' },
    { name: '书面 Offer 不看条款', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-sign'], endingId: 'ending-offer-terms' },
    { name: '入职时冲撞文化仪式', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-rude'], endingId: 'ending-onboarding-mismatch' },
    { name: '拒绝团建', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-ask', 'team-decline'], endingId: 'ending-teamfit' },
    { name: '早会只说空话', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-ask', 'team-attend', 'standup-vague'], endingId: 'ending-standup-vague' },
    { name: '紧急任务过度承诺', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-ask', 'team-attend', 'standup-report', 'urgent-promise'], endingId: 'ending-overtime' },
    { name: '线上事故无证据甩锅', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-ask', 'team-attend', 'standup-report', 'urgent-scope', 'incident-blame'], endingId: 'ending-scapegoat' },
    { name: '复盘只做自我检讨', choices: ['resume-specific', 'interview-specific', 'followup-know-metric', 'salary-range', 'offer-wait', 'written-review', 'onboarding-ask', 'team-attend', 'standup-report', 'urgent-scope', 'incident-facts', 'retro-self-blame'], endingId: 'ending-self-blame' },
  ];

  it.each(failPaths)('$name 会立即进入独立结局', ({ choices, endingId }) => {
    const state = play(choices);
    expect(getCurrentEvent(events, state).id).toBe(endingId);
    expect(getCurrentEvent(events, state).ending?.outcome).toBe('lost');
    expect(state.status).toBe('lost');
  });

  it('allows a careful route to reach a non-perfect but survivable ending', () => {
    const state = play([
      'resume-specific', 'interview-specific', 'followup-no-data', 'salary-range',
      'offer-wait', 'written-review', 'onboarding-ask', 'team-attend', 'standup-report',
      'urgent-scope', 'incident-facts', 'retro-action',
    ]);
    expect(getCurrentEvent(events, state).id).toBe('ending-survivor');
    expect(state.status).toBe('won');
    expect(state.decisions).toHaveLength(12);
  });

  it('does not allow choices after a run has ended', () => {
    const state = play(['resume-bluff']);
    expect(() => chooseOption(events, state, 'anything')).toThrow(/already ended/);
  });

  it('restart clears previous decisions and flags', () => {
    const previous = play(['resume-specific', 'interview-specific']);
    expect(previous.decisions.length).toBeGreaterThan(0);
    const restarted = startGame(START_EVENT_ID);
    expect(restarted.decisions).toEqual([]);
    expect(restarted.flags).toEqual([]);
    expect(restarted.currentEventId).toBe(START_EVENT_ID);
  });
});

describe('the performative-survival branch', () => {
  const routePrefix = [
    'resume-specific', 'interview-specific', 'followup-know-metric',
    'salary-range', 'offer-wait', 'written-review',
    'onboarding-ask', 'team-attend', 'standup-praise',
  ];

  it('lets flattery plus visible paperwork and strategic rest survive ironically', () => {
    const state = play([
      ...routePrefix, 'praise-roadmap', 'busy-pace', 'showcase-boundary',
    ]);
    expect(state.status).toBe('won');
    expect(getCurrentEvent(events, state).id).toBe('ending-visible-survivor');
    expect(state.flags).toEqual(expect.arrayContaining([
      'manager_pleased', 'scope_marked', 'strategic_slack',
    ]));
    expect(state.decisions).toHaveLength(12);
  });

  it.each([
    { name: 'overclaiming a release', after: ['praise-launch'], ending: 'ending-roadmap-fake' },
    { name: 'rejecting the visibility request outright', after: ['praise-facts'], ending: 'ending-visible-work' },
    { name: 'taking unlimited tasks', after: ['praise-roadmap', 'busy-overtime'], ending: 'ending-busy-overload' },
    { name: 'vanishing while slacking', after: ['praise-roadmap', 'busy-disappear'], ending: 'ending-busy-disappear' },
    { name: 'blaming the implementer', after: ['praise-roadmap', 'busy-pace', 'showcase-blame'], ending: 'ending-showcase-blame' },
    { name: 'accepting all delay liability', after: ['praise-roadmap', 'busy-pace', 'showcase-praise'], ending: 'ending-showcase-debt' },
  ])('$name ends immediately', ({ after, ending }) => {
    const state = play([...routePrefix, ...after]);
    expect(state.status).toBe('lost');
    expect(getCurrentEvent(events, state).id).toBe(ending);
  });

  it('requires prior receipts to claim credit for coordination at the demo', () => {
    const state = startGame(START_EVENT_ID);
    const showdown = events.find((event) => event.id === 'showcase-015');
    expect(showdown).toBeDefined();
    expect(getAvailableChoices(showdown!, state).map((choice) => choice.id)).not.toContain('showcase-boundary');
    const earned = play([...routePrefix, 'praise-roadmap', 'busy-pace']);
    expect(getAvailableChoices(getCurrentEvent(events, earned), earned).map((choice) => choice.id)).toContain('showcase-boundary');
  });

  it('resets the social capital and strategic rest flags on restart', () => {
    const complete = play([...routePrefix, 'praise-roadmap', 'busy-pace', 'showcase-boundary']);
    expect(complete.flags.length).toBeGreaterThan(0);
    expect(startGame(START_EVENT_ID).flags).toEqual([]);
  });
});
