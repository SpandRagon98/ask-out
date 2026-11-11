import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, MessageCircle, Pencil } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import { TIME_SLOTS } from '../data/restaurants';
import type { TimeChoice } from '../lib/plan';
import { tap, useScreenHeading } from '../lib/hooks';
import { Modal } from './Modal';

interface Props {
  value: TimeChoice;
  customTime: string;
  onSelect: (t: TimeChoice) => void;
  onCustomTime: (t: string) => void;
  onNext: () => void;
}

// Sunset in Kolkata in mid-November is a little before 5, so the sky goes
// from golden to properly dark across the slider.
const SKY = [
  ['#3A2E5C', '#D9697A', '#FFB38A'],
  ['#2C2452', '#A9557C', '#F0907A'],
  ['#211A43', '#6E3D6C', '#C9677A'],
  ['#161232', '#3F2858', '#84476A'],
  ['#0C0A1F', '#1E173C', '#3A2550'],
];
const SUN_Y = [176, 205, 250, 280, 300];
const MOON_Y = [260, 240, 150, 95, 62];
const MOON_O = [0, 0, 0.45, 0.9, 1];
const STAR_O = [0, 0.1, 0.35, 0.75, 1];
const WINDOW_O = [0.1, 0.25, 0.55, 0.85, 1];

const STARS = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 61 + 17) % 400,
  y: (i * 37 + 11) % 150,
  r: i % 5 === 0 ? 1.7 : 1,
  d: (i % 7) * 0.4,
}));

const WINDOWS = [
  [34, 214], [48, 214], [34, 230], [120, 200], [134, 200], [120, 218], [134, 236],
  [262, 206], [276, 206], [262, 224], [330, 196], [344, 196], [330, 214], [344, 232], [372, 220],
];

export function TimeSelection({ value, customTime, onSelect, onCustomTime, onNext }: Props) {
  const reduce = useReducedMotion();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [otherOpen, setOtherOpen] = useState(false);
  const [draft, setDraft] = useState(customTime);

  const slotIdx = TIME_SLOTS.findIndex((s) => s.id === value);
  const picked = slotIdx >= 0;
  const sky = picked ? slotIdx : 2;
  const slot = picked ? TIME_SLOTS[slotIdx] : undefined;

  const choose = (t: TimeChoice) => {
    if (t !== value) tap();
    onSelect(t);
  };
  const chooseIdx = (i: number) => choose(TIME_SLOTS[Math.max(0, Math.min(TIME_SLOTS.length - 1, i))].id);

  const t = reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };
  const bg = useMemo(() => {
    const [a, b, c] = SKY[sky];
    return `linear-gradient(180deg, ${a} 0%, ${b} 58%, ${c} 100%)`;
  }, [sky]);

  const readout = slot ? (
    <>
      <span className="font-display text-[clamp(3.4rem,min(17vw,11dvh),5.5rem)] font-medium leading-none tracking-[-0.03em]">
        {slot.label}
      </span>
      <span className="ml-1.5 text-[1rem] font-semibold tracking-[0.2em] text-cream/80">PM</span>
    </>
  ) : value === 'custom' ? (
    <span className="font-display text-[clamp(1.8rem,min(8vw,5.5dvh),2.6rem)] italic leading-tight [overflow-wrap:anywhere]">
      {customTime.trim() || 'Your call'}
    </span>
  ) : value === 'whatsapp' ? (
    <span className="font-display text-[clamp(1.8rem,min(8vw,5.5dvh),2.6rem)] italic leading-tight">On WhatsApp 💬</span>
  ) : (
    <span className="font-display text-[clamp(2.4rem,min(12vw,8dvh),4rem)] font-medium leading-none tracking-[-0.03em]">
      5–7<span className="text-cream/60">ish</span>
    </span>
  );

  const note = slot
    ? slot.note
    : value === 'custom'
      ? 'Noted. Very mysterious.'
      : value === 'whatsapp'
        ? 'Fair. Zero pressure.'
        : 'Slide it. Watch the sky.';

  return (
    <section className="scene max-w-md text-center" aria-labelledby="time-title">
      <header className="shrink-0 pt-1">
        <p className="eyebrow">Sunday · 15 November</p>
        <h1
          id="time-title"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          className="mt-1.5 font-display text-[clamp(1.8rem,min(8vw,4.6dvh),2.8rem)] font-medium leading-[1.05] tracking-[-0.02em]"
        >
          What time, <span className="italic text-glow">Madamji?</span>
        </h1>
      </header>

      {/* the sky */}
      <div className="relative mt-3 min-h-[9rem] flex-1 overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/10 tiny:mt-2">
        <motion.div className="absolute inset-0" initial={false} animate={{ background: bg }} transition={t} />
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="sun-glow">
              <stop offset="0" stopColor="#FFE2B0" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFB38A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.g initial={false} animate={{ opacity: STAR_O[sky] }} transition={t}>
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#FFF4E8"
                className="anim-twinkle"
                style={{ animationDelay: `${s.d}s`, transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            ))}
          </motion.g>
          <motion.g initial={false} animate={{ y: SUN_Y[sky] }} transition={t}>
            <circle cx="200" cy="0" r="80" fill="url(#sun-glow)" />
            <circle cx="200" cy="0" r="30" fill="#FFD9A0" />
          </motion.g>
          <motion.g initial={false} animate={{ y: MOON_Y[sky], opacity: MOON_O[sky] }} transition={t}>
            <circle cx="318" cy="0" r="17" fill="#FFF4E8" />
            <circle cx="326" cy="-6" r="15" fill={SKY[sky][0]} opacity="0.92" />
          </motion.g>
          {/* rooftops */}
          <g fill="#120C18">
            <path d="M0 300V206h22v-12h40v106zM62 300V226h40v74zM102 300V190h18v-8h34v118zM154 300V232h26v68zM180 300V214h14a26 26 0 0 1 52 0h14v86zM260 300V196h40v104zM300 300V228h18v72zM318 300V184h40v116zM358 300V208h42v92z" />
            <rect x="218" y="176" width="4" height="14" />
          </g>
          <motion.g initial={false} animate={{ opacity: WINDOW_O[sky] }} transition={t} fill="#F2C77B">
            {WINDOWS.map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="7" height="9" rx="1" opacity={i % 3 === 0 ? 0.6 : 1} />
            ))}
          </motion.g>
        </svg>

        <div className="relative flex h-full flex-col items-center justify-center px-5 pb-[18%]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value ?? 'none'}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <p className="flex items-baseline drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">{readout}</p>
              <p className="hand mt-1 text-[clamp(1.2rem,min(5vw,3.2dvh),1.5rem)] !text-cream">{note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* the slider */}
      <div className="mt-3 shrink-0 tiny:mt-2">
        <label htmlFor="time-range" className="sr-only">
          Start time on Sunday evening, 5 to 7 PM
        </label>
        <input
          id="time-range"
          type="range"
          min={0}
          max={TIME_SLOTS.length - 1}
          step={1}
          value={picked ? slotIdx : 2}
          aria-valuetext={slot ? `${slot.label} PM` : 'Not picked yet'}
          onChange={(e) => chooseIdx(Number(e.target.value))}
          onPointerUp={(e) => chooseIdx(Number((e.target as HTMLInputElement).value))}
          className="range"
          style={
            {
              '--track': `linear-gradient(90deg, ${SKY[0][2]}, ${SKY[2][1]}, ${SKY[4][1]})`,
              '--thumb': picked ? '#F2C77B' : 'rgba(255,244,232,0.5)',
            } as CSSProperties
          }
        />
        <div className="-mt-1 flex justify-between px-0.5" aria-hidden="true">
          {TIME_SLOTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              tabIndex={-1}
              onClick={() => chooseIdx(i)}
              className={`min-w-[2.5rem] py-1 text-[0.8rem] font-medium transition-colors ${
                i === slotIdx ? 'text-gold' : 'text-cream/50 hover:text-cream'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* other options */}
      <div className="mt-2 flex shrink-0 justify-center gap-2">
        <button
          type="button"
          onClick={() => setOtherOpen(true)}
          aria-pressed={value === 'custom'}
          className={`inline-flex min-h-[2.75rem] items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[0.88rem] font-medium transition ${
            value === 'custom' ? 'bg-gold text-plum-deep' : 'border border-white/15 bg-white/[0.07] text-cream hover:bg-white/[0.12]'
          }`}
        >
          {value === 'custom' ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : <Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
          Other time
        </button>
        <button
          type="button"
          onClick={() => choose(value === 'whatsapp' ? null : 'whatsapp')}
          aria-pressed={value === 'whatsapp'}
          className={`inline-flex min-h-[2.75rem] items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[0.88rem] font-medium transition ${
            value === 'whatsapp' ? 'bg-gold text-plum-deep' : 'border border-white/15 bg-white/[0.07] text-cream hover:bg-white/[0.12]'
          }`}
        >
          {value === 'whatsapp' ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : <MessageCircle className="h-4 w-4" aria-hidden="true" />}
          On WhatsApp
        </button>
      </div>

      <div className="shrink-0 pb-3 pt-3 tiny:pt-2">
        <motion.button type="button" className="btn-primary w-full max-w-xs" onClick={onNext} whileTap={{ scale: 0.96 }}>
          {value ? 'Okay, sorted' : 'Skip, decide later'} <span aria-hidden="true">→</span>
        </motion.button>
        <p className="hand mt-1 h-7 text-[1.2rem] tiny:hidden" aria-hidden={!value}>
          {value ? 'See? Not such a difficult question.' : ''}
        </p>
      </div>

      <Modal open={otherOpen} onClose={() => setOtherOpen(false)} title="Some other time">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCustomTime(draft.trim());
            choose('custom');
            setOtherOpen(false);
          }}
        >
          <p className="pr-8 text-left font-display text-[1.7rem] leading-tight">
            What time, <span className="italic text-glow">then?</span>
          </p>
          <label htmlFor="custom-time" className="sr-only">
            Your time (optional)
          </label>
          <input
            id="custom-time"
            type="text"
            autoComplete="off"
            maxLength={40}
            className="field mt-4"
            placeholder="e.g. 7:30, or after your nap"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary">
              That works
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
