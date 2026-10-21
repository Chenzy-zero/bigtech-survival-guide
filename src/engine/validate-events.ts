import type { GameEvent } from './game';

export function validateEvents(events: GameEvent[], startEventId: string): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (events.length === 0) return ['No events are defined.'];

  for (const event of events) {
    if (ids.has(event.id)) errors.push(`Duplicate event id: ${event.id}`);
    ids.add(event.id);
  }

  if (!ids.has(startEventId)) errors.push(`Start event does not exist: ${startEventId}`);

  for (const event of events) {
    if (event.ending) {
      if ((event.choices ?? []).length > 0) errors.push(`Ending event ${event.id} must not have choices.`);
      continue;
    }

    const choices = event.choices ?? [];
    if (choices.length < 2 || choices.length > 4) {
      errors.push(`Event ${event.id} must define 2–4 choices; found ${choices.length}.`);
    }

    const choiceIds = new Set<string>();
    for (const choice of choices) {
      if (choiceIds.has(choice.id)) errors.push(`Duplicate choice id ${choice.id} in event ${event.id}`);
      choiceIds.add(choice.id);
      if (!ids.has(choice.nextEventId)) {
        errors.push(`Choice ${choice.id} in event ${event.id} points to missing event ${choice.nextEventId}`);
      }
      const required = new Set(choice.requiresFlags ?? []);
      if ((choice.forbidsFlags ?? []).some((flag) => required.has(flag))) {
        errors.push(`Choice ${choice.id} in event ${event.id} both requires and forbids the same flag.`);
      }
    }
  }

  if (ids.has(startEventId)) {
    const byId = new Map(events.map((event) => [event.id, event]));
    const reachable = new Set<string>();
    const pending = [startEventId];

    while (pending.length > 0) {
      const id = pending.pop();
      if (!id || reachable.has(id)) continue;
      reachable.add(id);
      const event = byId.get(id);
      for (const choice of event?.choices ?? []) {
        if (byId.has(choice.nextEventId) && !reachable.has(choice.nextEventId)) {
          pending.push(choice.nextEventId);
        }
      }
    }

    for (const event of events) {
      if (!reachable.has(event.id)) errors.push(`Event is unreachable from ${startEventId}: ${event.id}`);
    }
    if (!events.some((event) => event.ending && reachable.has(event.id))) {
      errors.push(`No ending is reachable from ${startEventId}.`);
    }
  }

  return errors;
}
