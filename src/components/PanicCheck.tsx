import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { Wind } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useScreenHeading } from '../lib/hooks';

const LINES: [number, string][] = [
  [15, "Look at you. Chill queen. I'm proud."],
  [40, 'Okay, very manageable.'],
  [65, 'Mild panic. Normal. Carry on.'],
  [85, 'Classic you. I knew it 😂'],
  [101, "Arre, relax. It's just dinner."],
];

const lineFor = (v: number) => LINES.find(([max]) => v < max)![1];

/** Mixes the chill teal and the panic coral by level (0..100). */
function moodColor(v: number) {
  const t = v / 100;
  const a = [143, 211, 193];
  const b = [255, 122, 107];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * t));
  return `rgb(${c.join(',')})`;
}

type Breath = 'idle' | 'in' | 'out' | 'done';

export function PanicCheck({ onNext }: { onNext: () => void }) {
  const reduce = useReducedMotion();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [level, setLevel] = useState(82);
  const [breath, setBreath] = useState<Breath>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const breathe = () => {
    if (breath === 'in' || breath === 'out') return;
    const inMs = reduce ? 1200 : 4000;
    setBreath('in');
    timers.current.push(
      window.setTimeout(() => setBreath('out'), inMs),
      window.setTimeout(() => {
        setBreath('done');
        const from = level;
        const to = Math.max(4, from - 45);
        if (reduce) setLevel(to);
        else animate(from, to, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => setLevel(Math.round(v)) });
      }, inMs * 2),
    );
  };

  const color = moodColor(level);
  const face = level / 100; // 0 chill .. 1 panic
  const breathing = breath === 'in' || breath === 'out';

  return (
    <section className="scene max-w-xl text-center" aria-labelledby="panic-title">
      <div className="shrink-0 pt-1">
        <p className="eyebrow">Before anything</p>
        <h1
          id="panic-title"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          className="mt-2 font-display text-[clamp(2rem,min(9vw,5.6dvh),3.4rem)] font-medium leading-[1.05] tracking-[-0.02em]"
        >
          Quick <span className="italic text-glow">panic</span> check.
        </h1>
        <p className="mt-1.5 text-[0.98rem] text-cream/65">Be honest, Madamji.</p>
      </div>

      {/* the face + glow, reacting to the slider */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <motion.div
          className="absolute aspect-square w-[min(70vw,34dvh)] rounded-full blur-[50px]"
          animate={{ backgroundColor: color, scale: breath === 'in' ? 1.25 : breath === 'out' ? 0.85 : 1, opacity: 0.45 }}
          transition={{ duration: breathing ? (reduce ? 1.2 : 4) : 0.4, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <motion.div
          className="relative"
          animate={{ scale: breath === 'in' ? 1.18 : breath === 'out' ? 0.9 : 1 }}
          transition={{ duration: breathing ? (reduce ? 1.2 : 4) : 0.4, ease: 'easeInOut' }}
        >
          <div className={level > 92 && !breathing ? 'anim-shake' : undefined}>
            <PanicFace level={face} className="h-[min(42vw,22dvh)] w-[min(42vw,22dvh)]" />
          </div>
          <AnimatePresence>
            {breathing && (
              <motion.p
                key={breath}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 -bottom-9 font-display text-[1.3rem] italic text-cream"
              >
                {breath === 'in' ? 'Breathe in…' : 'and out…'}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* slider */}
      <div className="shrink-0">
        <div className="h-[3.2rem] tiny:h-[2.8rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={breath === 'done' && level < 40 ? 'done' : lineFor(level)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="hand text-[clamp(1.35rem,min(5.6vw,3.2dvh),1.7rem)]"
            >
              {breath === 'done' && level < 40 ? 'See? Chill. Spandan-certified.' : lineFor(level)}
            </motion.p>
          </AnimatePresence>
        </div>

        <label htmlFor="panic-level" className="sr-only">
          Current panic level, from totally chill to full panic
        </label>
        <input
          id="panic-level"
          type="range"
          min={0}
          max={100}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="range"
          aria-valuetext={`${level} percent panic. ${lineFor(level)}`}
          style={
            {
              '--track': `linear-gradient(90deg, #8FD3C1 0%, #F2C77B 50%, #FF7A6B 100%)`,
              '--thumb': color,
            } as CSSProperties
          }
        />
        <div className="-mt-1 flex justify-between text-[0.78rem] font-medium text-cream/60">
          <span>Totally chill 😌</span>
          <span>Full panic 😵‍💫</span>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2.5 pb-4 tiny:mt-3 tiny:pb-2 sm:flex-row sm:justify-center">
          <button type="button" className="btn-glass w-full max-w-xs sm:w-auto" onClick={breathe} disabled={breathing}>
            <Wind className="h-4 w-4" aria-hidden="true" />
            {breathing ? 'Breathing…' : breath === 'done' ? 'One more breath' : 'Breathe with me'}
          </button>
          <button type="button" className="btn-primary w-full max-w-xs sm:w-auto" onClick={onNext}>
            {level > 60 ? "I'm… fine. Go on" : "Okay, I'm chill. Go on"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/** A face that goes from blissed-out to full meltdown as `level` goes 0 → 1. */
function PanicFace({ level, className }: { level: number; className?: string }) {
  const ink = '#2A1830';
  // mouth: smile (positive curve) to wobbly "o"
  const smile = 14 - level * 26; // control point offset
  const brow = level * 9; // inner brow lift
  const eyeH = 6 + level * 5;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="face-fill" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFF4E8" />
          <stop offset="1" stopColor="#F8DFAE" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#face-fill)" />
      {/* cheeks */}
      <ellipse cx="34" cy="72" rx="9" ry="5" fill="#E58FA0" opacity={0.55 - level * 0.25} />
      <ellipse cx="86" cy="72" rx="9" ry="5" fill="#E58FA0" opacity={0.55 - level * 0.25} />
      {/* brows */}
      <path d={`M32 ${42 - brow * 0.2} L48 ${42 - brow}`} stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
      <path d={`M88 ${42 - brow * 0.2} L72 ${42 - brow}`} stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
      {/* eyes: content closed arcs when chill, wide dots when panicking */}
      {level < 0.3 ? (
        <>
          <path d="M34 56 q7 6 14 0" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M72 56 q7 6 14 0" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="41" cy="56" rx={4 + level * 2} ry={eyeH / 2 + 1} fill={ink} />
          <ellipse cx="79" cy="56" rx={4 + level * 2} ry={eyeH / 2 + 1} fill={ink} />
          <circle cx="42.5" cy="54" r="1.6" fill="#fff" />
          <circle cx="80.5" cy="54" r="1.6" fill="#fff" />
        </>
      )}
      {/* mouth */}
      {level < 0.85 ? (
        <path d={`M44 80 Q60 ${80 + smile} 76 80`} stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="60" cy="84" rx="8" ry="10" fill={ink} />
      )}
      {/* sweat drops appear as panic rises */}
      <path
        d="M96 30 c3.5 6 6 9.5 6 12.5 a6 6 0 0 1 -12 0 c0 -3 2.5 -6.5 6 -12.5z"
        fill="#9FD0E8"
        opacity={level > 0.45 ? 1 : 0}
        style={{ transition: 'opacity .3s' }}
      />
      <path
        d="M20 40 c2.5 4.5 4.5 7 4.5 9.4 a4.5 4.5 0 0 1 -9 0 c0 -2.4 2 -4.9 4.5 -9.4z"
        fill="#9FD0E8"
        opacity={level > 0.75 ? 1 : 0}
        style={{ transition: 'opacity .3s' }}
      />
    </svg>
  );
}
