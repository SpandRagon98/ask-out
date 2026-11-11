import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { LaptopDoodle } from './DecorativeIllustrations';
import { useScreenHeading } from '../lib/hooks';

interface Note {
  text: ReactNode;
  extra?: ReactNode;
  tint: string;
}

const NOTES: Note[] = [
  { text: "I could've just texted you.", extra: <span className="hand-ink">Would've been much easier.</span>, tint: '#FFF4E8' },
  {
    text: 'But apparently, a whole website felt like a better idea.',
    extra: <LaptopDoodle className="mx-auto mt-1 w-[min(11rem,40%)]" />,
    tint: '#FDE9DF',
  },
  { text: "Don't ask me why.", extra: <span className="hand-ink">Even I'm questioning some of my decisions.</span>, tint: '#F8DFAE' },
  { text: 'Anyway… I was thinking we should actually go out somewhere.', tint: '#F2D6DC' },
  {
    text: (
      <>
        Good food. Random talks. Me annoying you <em className="text-rose-deep">in person</em> for a change.
      </>
    ),
    tint: '#E4F1EC',
  },
  { text: 'Nothing fancy. Just a nice, chill evening.', extra: <span className="hand-ink">Sounds like a plan to me.</span>, tint: '#FFF4E8' },
];

const tilt = (i: number) => [-3, 2.5, -1.5, 3, -2.5, 1.5][i % 6];

export function Introduction({ onNext }: { onNext: () => void }) {
  const reduce = useReducedMotion();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [top, setTop] = useState(0);
  const [dir, setDir] = useState(1);
  const done = top >= NOTES.length;

  const toss = (d = 1) => {
    setDir(d);
    setTop((t) => Math.min(NOTES.length, t + 1));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) toss(info.offset.x > 0 ? 1 : -1);
  };

  return (
    <section className="scene max-w-xl text-center" aria-labelledby="intro-title">
      <div className="shrink-0 pt-1">
        <h1
          id="intro-title"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          className="font-display text-[clamp(1.9rem,min(8.4vw,5.2dvh),3.1rem)] font-medium leading-[1.05] tracking-[-0.02em]"
        >
          Okay, so here's <span className="italic text-glow">the thing.</span>
        </h1>
        <p className="mt-1.5 text-[0.92rem] text-cream/60">
          {done ? 'That was all of them.' : 'Swipe or tap the notes'}
        </p>
      </div>

      {/* the deck */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
        <div className="relative aspect-[4/5] h-full max-h-[26rem] w-auto max-w-full">
          <AnimatePresence custom={dir}>
            {NOTES.map((n, i) => {
              if (i < top) return null;
              const depth = i - top;
              if (depth > 2) return null;
              const isTop = depth === 0;
              return (
                <motion.div
                  key={i}
                  custom={dir}
                  className="absolute inset-0 flex cursor-grab flex-col items-center justify-center rounded-[1.6rem] px-6 text-plum-deep shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] active:cursor-grabbing"
                  style={{ backgroundColor: n.tint, zIndex: 10 - depth }}
                  initial={false}
                  animate={{
                    rotate: tilt(i) * (isTop ? 0.4 : 1),
                    scale: 1 - depth * 0.05,
                    y: depth * 14,
                    opacity: depth === 2 ? 0.7 : 1,
                  }}
                  variants={{
                    gone: (d: number) =>
                      reduce
                        ? { opacity: 0, transition: { duration: 0.15 } }
                        : { x: d * 420, rotate: d * 22, opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  exit="gone"
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  drag={isTop && !reduce ? 'x' : false}
                  dragSnapToOrigin
                  onDragEnd={isTop ? onDragEnd : undefined}
                  onClick={isTop ? () => toss(1) : undefined}
                  aria-hidden={!isTop}
                >
                  {/* tape */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-gold/70"
                  />
                  <span className="absolute left-5 top-4 font-hand text-[1.1rem] text-plum-deep/40" aria-hidden="true">
                    {i + 1}/{NOTES.length}
                  </span>
                  <p
                    aria-live={isTop ? 'polite' : undefined}
                    className="font-display text-[clamp(1.45rem,min(6.4vw,3.6dvh),2.1rem)] font-medium leading-[1.15] tracking-[-0.01em] text-balance"
                  >
                    {n.text}
                  </p>
                  {n.extra && <div className="mt-3 w-full">{n.extra}</div>}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* once the deck is empty */}
          <AnimatePresence>
            {done && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                <p className="font-display text-[clamp(1.8rem,min(8vw,5dvh),2.6rem)] italic leading-tight">
                  Okay. So.
                </p>
                <p className="hand mt-2 text-[1.5rem]">Yes, I'm getting to the point.</p>
                <button type="button" className="btn-link mt-3 text-sm" onClick={() => setTop(0)}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Read them again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex shrink-0 justify-center pb-5 tiny:pb-3">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.button
              key="go"
              type="button"
              className="btn-primary w-full max-w-xs"
              onClick={onNext}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Okay, go on <span aria-hidden="true">→</span>
            </motion.button>
          ) : (
            <motion.button
              key="next"
              type="button"
              className="btn-glass w-full max-w-xs"
              onClick={() => toss(1)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Next note ({top + 1}/{NOTES.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
