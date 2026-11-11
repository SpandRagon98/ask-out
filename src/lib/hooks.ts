import { useEffect, useRef } from 'react';

/**
 * Moves focus to a screen's main heading when that screen appears, so
 * keyboard and screen-reader users land on the new content.
 */
export function useScreenHeading<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(id);
  }, [enabled]);
  return ref;
}

/** A tiny buzz on phones that support it. Harmless everywhere else. */
export function tap(ms = 12) {
  try {
    const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation;
    if (activation && !activation.isActive) return;
    if ('vibrate' in navigator) navigator.vibrate(ms);
  } catch {
    /* some browsers throw if vibration is blocked; that's fine */
  }
}
