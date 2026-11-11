import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { CoffeeCup, RisingSun } from './DecorativeIllustrations';
import { useSay } from './Toast';
import { useScreenHeading } from '../lib/hooks';

interface Props {
  onNext: () => void;
  focusOnMount: boolean;
}

const big = 'font-display font-medium leading-[1.02] tracking-[-0.025em] text-[clamp(2.4rem,min(11vw,7.5dvh),5rem)] text-balance';
const small = 'text-[clamp(1rem,min(4.4vw,2.6dvh),1.25rem)] text-cream/75';

export function MorningGreeting({ onNext, focusOnMount }: Props) {
  const say = useSay();
  const reduce = useReducedMotion();
  const heading = useScreenHeading<HTMLHeadingElement>(focusOnMount);
  const [beat, setBeat] = useState(0);
  const [sips, setSips] = useState(0);
  const [notMorning] = useState(() => new Date().getHours() >= 12);

  const beats: ReactNode[] = [
    <>
      <p className={big}>
        Good morning, <span className="italic text-glow">Madamji.</span>
      </p>
      {notMorning && <p className="hand mt-4 text-[1.3rem]">(I know it might not be morning. Just go with it.)</p>}
    </>,
    <>
      <p className={small}>Or should I say…</p>
      <p className={`${big} mt-3`}>
        Good morning, <span className="italic text-glow">Debalina</span>?
      </p>
    </>,
    <>
      <p className={big}>Hope you slept well.</p>
      <p className={`${small} mx-auto mt-4 max-w-md`}>
        Like, properly well. Went to another dimension, lived a whole life there, and still made it back on time.
      </p>
    </>,
    <>
      <p className={big}>Anyway, welcome back.</p>
      <p className={`${small} mt-4`}>I have something slightly random for you.</p>
      <p className="hand mt-1 text-[1.45rem]">Don't judge me already, okay?</p>
    </>,
  ];
  const last = beats.length - 1;
  const next = () => setBeat((b) => Math.min(last, b + 1));

  // Space / arrow keys move through the beats too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowRight' || e.key === ' ') && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="scene max-w-3xl text-center" aria-labelledby="morning-title">
      <h1 id="morning-title" ref={heading} tabIndex={-1} data-screen-heading className="sr-only">
        Okay, so I have a question. A tiny Sunday plan.
      </h1>

      <motion.div
        className="shrink-0 pt-2 tiny:pt-0"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p className="font-display text-[0.95rem] italic text-cream/70">Okay, so I have a question.</p>
        <p className="eyebrow mt-1">A tiny Sunday plan</p>
      </motion.div>

      {/* the beats: tap anywhere in here */}
      <div
        className="relative flex min-h-0 flex-1 cursor-pointer select-none flex-col items-center justify-center"
        onClick={beat < last ? next : undefined}
      >
        <div aria-live="polite" className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={beat}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {beats[beat]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* beat ticks */}
        <div className="mt-7 flex justify-center gap-1.5 tiny:mt-4" aria-hidden="true">
          {beats.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === beat ? 'w-6 bg-gold' : i < beat ? 'w-2 bg-gold/60' : 'w-2 bg-cream/20'}`}
            />
          ))}
        </div>
      </div>

      {/* bottom: the CTA, then the sunrise */}
      <div className="relative shrink-0">
        <div className="flex h-[4.5rem] items-center justify-center">
          <AnimatePresence mode="wait">
            {beat < last ? (
              <motion.button
                key="tap"
                type="button"
                onClick={next}
                className="btn-glass"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: beat === 0 ? 1.2 : 0.3 }}
              >
                Tap to continue <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            ) : (
              <motion.button
                key="go"
                type="button"
                className="btn-primary w-full max-w-xs"
                onClick={onNext}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
              >
                Achha, show me <span aria-hidden="true">→</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full max-w-[min(360px,42dvh)]">
          <RisingSun className="w-full" />
          <motion.button
            type="button"
            onClick={() => {
              setSips((s) => s + 1);
              say(sips >= 2 ? 'Okay, that’s enough coffee. Go on now.' : 'Coffee first. Important decisions later.');
            }}
            aria-label="Tap the coffee cup"
            className="absolute bottom-[13%] right-[1%] grid h-14 w-14 place-items-end justify-center rounded-full"
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ rotate: [0, -10, 8, -4, 0], scale: 0.94, transition: { duration: 0.45 } }}
            transition={{ delay: reduce ? 0 : 1.6, type: 'spring', stiffness: 260, damping: 18 }}
          >
            <CoffeeCup className="h-11 w-11" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
