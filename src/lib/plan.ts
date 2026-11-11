import { getRestaurant, getSlot, type RestaurantId, type TimeSlotId } from '../data/restaurants';

export type ScreenId = 'morning' | 'panic' | 'intro' | 'question' | 'food' | 'time' | 'plan' | 'declined';

export const STEPS: ScreenId[] = ['morning', 'panic', 'intro', 'question', 'food', 'time', 'plan'];

export type RestaurantChoice = RestaurantId | 'custom' | null;
export type TimeChoice = TimeSlotId | 'custom' | 'whatsapp' | null;

export interface PlanState {
  response: 'yes' | 'no' | null;
  restaurant: RestaurantChoice;
  customRestaurant: string;
  time: TimeChoice;
  customTime: string;
}

export const INITIAL_PLAN: PlanState = {
  response: null,
  restaurant: null,
  customRestaurant: '',
  time: null,
  customTime: '',
};

const clean = (s: string, max = 80) => s.replace(/\s+/g, ' ').trim().slice(0, max);

export type PlaceSummary =
  | { kind: 'listed'; name: string; id: RestaurantId }
  | { kind: 'custom'; name: string }
  | { kind: 'undecided' };

export type TimeSummary =
  | { kind: 'slot'; display: string; short: string }
  | { kind: 'custom'; display: string }
  | { kind: 'undecided' };

export function summarisePlace(p: PlanState): PlaceSummary {
  if (p.restaurant === 'custom') {
    const name = clean(p.customRestaurant);
    return name ? { kind: 'custom', name } : { kind: 'undecided' };
  }
  const r = getRestaurant(p.restaurant);
  return r ? { kind: 'listed', name: r.name, id: r.id } : { kind: 'undecided' };
}

export function summariseTime(p: PlanState): TimeSummary {
  if (p.time === 'custom') {
    const t = clean(p.customTime, 40);
    return t ? { kind: 'custom', display: t } : { kind: 'undecided' };
  }
  const slot = getSlot(p.time);
  return slot ? { kind: 'slot', display: `${slot.label} PM`, short: slot.short } : { kind: 'undecided' };
}

/** The message she sends back. Written to sound like her, not like a form. */
export function buildReply(p: PlanState): string {
  const place = summarisePlace(p);
  const time = summariseTime(p);

  const timeLine =
    time.kind === 'slot'
      ? `Sunday around ${time.short} works for me.`
      : time.kind === 'custom'
        ? `Sunday, ${time.display} works for me.`
        : null;

  if (place.kind === 'listed') {
    if (timeLine) {
      return ['Okay Spandan 😂', `${place.name} sounds good!`, timeLine, "Let's plan it :)"].join('\n');
    }
    return [`Okayyy, ${place.name} looks good 😂`, "Let's figure out the timing for Sunday!"].join('\n');
  }

  if (place.kind === 'custom') {
    return [
      'Okay, I have a better idea 👀',
      `How about ${place.name}?`,
      timeLine ? `${timeLine} Let's plan it :)` : "Let's figure out the timing!",
    ].join('\n');
  }

  if (time.kind !== 'undecided') {
    const when =
      time.kind === 'slot'
        ? `Around ${time.short}`
        : time.display.charAt(0).toUpperCase() + time.display.slice(1);
    return ["Okay, I'm up for Sunday :)", `${when} works for me.`, "Let's decide the place on WhatsApp."].join('\n');
  }
  return ["Okay, I'm up for Sunday :)", "Let's decide the place and timing on WhatsApp."].join('\n');
}

/**
 * wa.me without a phone number opens WhatsApp's own chat picker (app on phones,
 * WhatsApp Web / Desktop on computers). Nothing is sent until she presses send.
 */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
