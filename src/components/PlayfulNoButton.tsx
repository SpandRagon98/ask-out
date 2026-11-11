import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_DODGES = 2;
const LINES = ['Arre, wait 😂', 'Okay, that was unexpected.'];
const BEHAVE = "Fine, fine. I'll behave.";

/**
 * The "Nope" button. It's a joke, not a trap:
 *  - with a mouse it slides away when approached, at most twice;
 *  - on a phone it hops on the first two taps, at most twice;
 *  - keyboard and assistive-tech activation (click with detail 0) always works;
 *  - after two dodges it goes back to its spot and behaves.
 */
export function PlayfulNoButton({ onDecline }: { onDecline: () => void }) {
  const reduce = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);
  const dodgesRef = useRef(0);
  const offsetRef = useRef({ x: 0, y: 0 });
  const settleTimer = useRef<number>();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [line, setLine] = useState<string | null>(null);

  const dodge = useCallback(() => {
    const el = btnRef.current;
    if (!el || dodgesRef.current >= MAX_DODGES) return false;

    const attempt = dodgesRef.current;
    const rect = el.getBoundingClientRect();
    // Where the button sits when it isn't dodging.
    const homeLeft = rect.left - offsetRef.current.x;
    const box = el.closest('[data-dodge-bounds]')?.getBoundingClientRect();
    const left = box?.left ?? 0;
    const right = box?.right ?? document.documentElement.clientWidth;
    const margin = 14;

    // Hop up and sideways (the Yes button sits beside it, never above it),
    // first one way, then the other.
    const wantX = attempt === 0 ? rect.width * 0.6 : -(rect.width * 1.4);
    const minX = left + margin - homeLeft;
    const maxX = right - margin - rect.width - homeLeft;
    let x = Math.max(minX, Math.min(maxX, wantX));
    // If there's no room that way (tiny screens), hop the other way instead.
    if (Math.abs(x) < 24) x = Math.max(minX, Math.min(maxX, -wantX));
    const y = attempt === 0 ? -78 : -64;

    dodgesRef.current = attempt + 1;
    offsetRef.current = { x, y };
    setOffset({ x, y });
    setLine(LINES[attempt]);

    if (dodgesRef.current >= MAX_DODGES) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        offsetRef.current = { x: 0, y: 0 };
        setOffset({ x: 0, y: 0 });
        setLine(BEHAVE);
        settleTimer.current = window.setTimeout(() => setLine(null), 2600);
      }, 1500);
    }
    return true;
  }, []);

  // React's touch listeners are passive, so preventDefault (which stops the
  // follow-up click from landing on whatever ends up under her finger) needs
  // a native, non-passive listener.
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (dodgesRef.current < MAX_DODGES) {
        e.preventDefault();
        dodge();
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      window.clearTimeout(settleTimer.current);
    };
  }, [dodge]);

  // The bubble sits above the button, hugging the side it fled towards so it
  // stays on screen.
  const bubblePos = offset.x < 0 ? 'bottom-full mb-2 left-0' : 'bottom-full mb-2 right-0';
  const bubbleX = '0%';

  return (
    <motion.div
      className="relative z-10"
      animate={{ x: offset.x, y: offset.y }}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 26, mass: 0.7 }}
    >
      <AnimatePresence mode="wait">
        {line && (
          <motion.span
            key={line}
            role="status"
            initial={{ opacity: 0, x: bubbleX, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, x: bubbleX, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: bubbleX, y: -4 }}
            className={`pointer-events-none absolute whitespace-nowrap rounded-xl bg-cream px-3 py-1.5 font-hand text-[1.25rem] leading-none text-plum-deep shadow-glow ${bubblePos}`}
          >
            {line}
          </motion.span>
        )}
      </AnimatePresence>
      <button
        ref={btnRef}
        type="button"
        className="btn-glass min-h-[3.25rem] px-6 text-[1rem]"
        aria-label="Nope, I'd rather not"
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') dodge();
        }}
        onClick={onDecline}
      >
        Nope 😂
      </button>
    </motion.div>
  );
}
