import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useRef } from 'react';
import { useSay } from './Toast';

const CHILL_LINES = [
  "Relax. It's just dinner.",
  'Breathe in. Breathe out. Good.',
  "I'm chill enough for both of us. Sorted.",
  'Nothing to panic about. Except maybe the menu.',
  'Panic request received. Request denied 😌',
  "Arre, it's fine. Everything is fine.",
  'Okay, drama queen. Sit down. Have water.',
];

interface Props {
  current: number;
  total: number;
  onBack?: () => void;
}

export function ProgressIndicator({ current, total, onBack }: Props) {
  const say = useSay();
  const presses = useRef(0);

  const panic = () => {
    presses.current += 1;
    const n = presses.current;
    if (n === 5) say("Five panics already? Very on brand 😂");
    else if (n === 10) say('Okay, I am confiscating this button.');
    else say(CHILL_LINES[(n - 1) % CHILL_LINES.length]);
  };

  return (
    <div className="scene max-w-6xl !h-auto shrink-0 !flex-row items-center justify-between py-2.5 tiny:py-1.5">
      <div className="w-[4.5rem]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="grid h-11 w-11 place-items-center rounded-full text-cream/70 transition hover:bg-white/10 hover:text-cream active:scale-95"
            aria-label="Go back one step"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className="flex items-center gap-1.5"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
        aria-valuetext={`Step ${current + 1} of ${total}`}
      >
        {Array.from({ length: total }, (_, i) => (
          <motion.span
            key={i}
            className="block h-1.5 rounded-full"
            initial={false}
            animate={{
              width: i === current ? 22 : 6,
              backgroundColor: i <= current ? '#F2C77B' : 'rgba(255,244,232,0.2)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        ))}
      </div>

      <div className="flex w-[4.5rem] justify-end">
        <motion.button
          type="button"
          onClick={panic}
          whileTap={{ scale: 0.88, rotate: -6 }}
          className="relative inline-flex h-9 items-center gap-1 rounded-full border border-panic/40 bg-panic/15 px-2.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#FFB3A8] transition hover:bg-panic/25"
          aria-label="Panic button. Press if panicking."
        >
          <span className="anim-pulse-ring absolute inset-0 rounded-full border border-panic/50" aria-hidden="true" />
          <span aria-hidden="true">😵‍💫</span>
          Panic
        </motion.button>
      </div>
    </div>
  );
}
