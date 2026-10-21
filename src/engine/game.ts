export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameChoice {
  id: string;
  text: string;
  feedback: string;
  nextEventId: string;
  setFlags?: string[];
  requiresFlags?: string[];
  forbidsFlags?: string[];
}

export interface GameEnding {
  outcome: Exclude<GameStatus, 'playing'>;
  label: string;
  title: string;
  body: string;
  explanation: string;
}

export interface GameEvent {
  id: string;
  chapter: string;
  title: string;
  body: string;
  choices?: GameChoice[];
  ending?: GameEnding;
}

export interface DecisionRecord {
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceText: string;
  feedback: string;
}

export interface GameState {
  currentEventId: string;
  decisions: DecisionRecord[];
  flags: string[];
  status: GameStatus;
  lastFeedback?: string;
}

export function startGame(startEventId = 'resume-001'): GameState {
  return {
    currentEventId: startEventId,
    decisions: [],
    flags: [],
    status: 'playing',
  };
}

export function getCurrentEvent(events: GameEvent[], state: GameState): GameEvent {
  const event = events.find((candidate) => candidate.id === state.currentEventId);
  if (!event) {
    throw new Error(`Unknown event id: ${state.currentEventId}`);
  }
  return event;
}

export function getAvailableChoices(event: GameEvent, state: GameState): GameChoice[] {
  return (event.choices ?? []).filter((choice) => {
    const hasRequiredFlags = (choice.requiresFlags ?? []).every((flag) => state.flags.includes(flag));
    const hasForbiddenFlags = (choice.forbidsFlags ?? []).some((flag) => state.flags.includes(flag));
    return hasRequiredFlags && !hasForbiddenFlags;
  });
}

export function chooseOption(events: GameEvent[], state: GameState, choiceId: string): GameState {
  if (state.status !== 'playing') {
    throw new Error('This run has already ended. Start a new game to continue.');
  }

  const currentEvent = getCurrentEvent(events, state);
  if (currentEvent.ending) {
    throw new Error('Cannot choose an option on an ending event.');
  }

  const choice = getAvailableChoices(currentEvent, state).find((candidate) => candidate.id === choiceId);
  if (!choice) {
    throw new Error(`Choice ${choiceId} is not available for event ${currentEvent.id}.`);
  }

  const nextEvent = events.find((candidate) => candidate.id === choice.nextEventId);
  if (!nextEvent) {
    throw new Error(`Choice ${choice.id} points to missing event ${choice.nextEventId}.`);
  }

  const flags = [...new Set([...state.flags, ...(choice.setFlags ?? [])])];
  const decision: DecisionRecord = {
    eventId: currentEvent.id,
    eventTitle: currentEvent.title,
    choiceId: choice.id,
    choiceText: choice.text,
    feedback: choice.feedback,
  };

  return {
    currentEventId: nextEvent.id,
    decisions: [...state.decisions, decision],
    flags,
    status: nextEvent.ending?.outcome ?? 'playing',
    lastFeedback: choice.feedback,
  };
}
