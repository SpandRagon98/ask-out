import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RESTAURANTS, getRestaurant } from '../data/restaurants';
import type { RestaurantChoice } from '../lib/plan';
import { tap, useScreenHeading } from '../lib/hooks';
import { Modal } from './Modal';
import { RestaurantCard } from './RestaurantCard';
import { useSay } from './Toast';

interface Props {
  value: RestaurantChoice;
  customName: string;
  onSelect: (choice: RestaurantChoice) => void;
  onCustomName: (name: string) => void;
  onNext: () => void;
}

export function RestaurantSelection({ value, customName, onSelect, onCustomName, onNext }: Props) {
  const say = useSay();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(() => Math.max(0, RESTAURANTS.findIndex((r) => r.id === value)));
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [draft, setDraft] = useState(customName);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const slides = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides().forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = (i: number, smooth = true) => {
    const track = trackRef.current;
    const el = slides()[i];
    if (!track || !el) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Start on her current pick when she comes back to change it.
  useEffect(() => {
    if (active > 0) goTo(active, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (choice: RestaurantChoice) => {
    tap();
    onSelect(choice);
  };

  const listed = getRestaurant(value);
  const hasChoice = value !== null;
  const customLabel = customName.trim() || 'Somewhere else';

  return (
    <section className="scene max-w-6xl" aria-labelledby="food-title">
      <header className="shrink-0 pt-1 text-center">
        <h1
          id="food-title"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          className="font-display text-[clamp(1.7rem,min(7.4vw,4.4dvh),3rem)] font-medium leading-[1.05] tracking-[-0.02em]"
        >
          Shortlisted <span className="italic text-glow">three places.</span>{' '}
          <motion.button
            type="button"
            onClick={() => say("I'm hungry now. Great.")}
            aria-label="A bowl of noodles"
            className="inline-block align-middle text-[0.8em]"
            whileTap={{ scale: 0.8, rotate: -12 }}
            whileHover={{ rotate: 10 }}
          >
            🍜
          </motion.button>
        </h1>
        <p className="mt-1 text-[0.9rem] text-cream/60 tiny:hidden">Actual research. Mostly staring at food pictures.</p>
      </header>

      {/* Cards: swipeable on phones and tablets, three columns on desktop */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Restaurant shortlist"
        className="relative mt-3 flex min-h-0 flex-1 flex-col tiny:mt-2"
      >
        <div
          ref={trackRef}
          onScroll={updateActive}
          className="no-scrollbar -mx-[var(--gutter)] flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[var(--gutter)] py-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0"
        >
          {RESTAURANTS.map((r, i) => (
            <div key={r.id} className="h-full w-[min(82vw,24rem)] shrink-0 snap-center sm:w-[min(60vw,24rem)] lg:w-auto">
              <RestaurantCard
                restaurant={r}
                index={i}
                total={RESTAURANTS.length}
                active={wide || i === active}
                selected={value === r.id}
                onSelect={() => {
                  choose(r.id);
                  if (!wide) goTo(i);
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            className="grid h-10 w-10 place-items-center rounded-full text-cream transition hover:bg-white/10 disabled:opacity-30"
            aria-label="Previous restaurant"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {RESTAURANTS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goTo(i)}
              className="grid h-10 w-6 place-items-center"
              aria-label={`Show ${r.name}`}
              aria-current={i === active ? 'true' : undefined}
            >
              <motion.span
                className="block h-1.5 rounded-full"
                initial={false}
                animate={{
                  width: i === active ? 20 : 6,
                  backgroundColor: value === r.id ? '#F2C77B' : i === active ? '#FFF4E8' : 'rgba(255,244,232,0.3)',
                }}
              />
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo(Math.min(RESTAURANTS.length - 1, active + 1))}
            disabled={active === RESTAURANTS.length - 1}
            className="grid h-10 w-10 place-items-center rounded-full text-cream transition hover:bg-white/10 disabled:opacity-30"
            aria-label="Next restaurant"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* her own idea + continue */}
      <div className="shrink-0 pb-3 lg:pt-5">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
          {value === 'custom' ? (
            <button
              type="button"
              onClick={() => setIdeaOpen(true)}
              className="inline-flex min-h-[3.25rem] min-w-0 items-center gap-2 rounded-full bg-gold px-4 text-[0.92rem] font-semibold text-plum-deep"
              aria-label={`Your idea: ${customLabel}. Edit`}
            >
              <Check className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden="true" />
              <span className="truncate">{customLabel}</span>
              <Pencil className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-glass min-h-[3.25rem] shrink-0 px-4 text-[0.92rem]"
              onClick={() => setIdeaOpen(true)}
            >
              Better idea 👀
            </button>
          )}

          <button
            type="button"
            className="btn-primary min-w-0 flex-1 whitespace-nowrap px-5 sm:flex-none"
            onClick={() => {
              if (!hasChoice) onSelect(null);
              onNext();
            }}
          >
            {hasChoice ? (
              <>
                Now, the timing <span aria-hidden="true">→</span>
              </>
            ) : (
              'Skip, decide later'
            )}
          </button>
        </div>
        <div className="mt-1 h-7 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={hasChoice ? `picked-${value}` : 'none'}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              className={hasChoice ? 'hand text-[1.3rem]' : 'text-[0.82rem] text-cream/50'}
            >
              {hasChoice ? (
                <>
                  Good choice, Madamji.
                  <span className="sr-only">{listed ? ` ${listed.name} selected.` : ' Your own idea selected.'}</span>
                </>
              ) : (
                "Can't decide? We'll sort it on WhatsApp."
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <Modal open={ideaOpen} onClose={() => setIdeaOpen(false)} title="Your better idea">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCustomName(draft.trim());
            choose('custom');
            setIdeaOpen(false);
          }}
        >
          <p className="pr-8 font-display text-[1.7rem] leading-tight">
            Okay, where to, <span className="italic text-glow">Madamji?</span>
          </p>
          <p className="mt-1 text-[0.9rem] text-cream/60">I'm not emotionally attached to my shortlist. Promise.</p>
          <label htmlFor="custom-place" className="sr-only">
            Restaurant name (optional)
          </label>
          <input
            id="custom-place"
            type="text"
            autoComplete="off"
            maxLength={80}
            className="field mt-4"
            placeholder="That place you keep talking about…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <p className="mt-2 text-[0.8rem] text-cream/50">Optional. Blank is fine, we'll figure it out on WhatsApp.</p>
          <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
            {value === 'custom' && (
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  onSelect(null);
                  setIdeaOpen(false);
                }}
              >
                Back to the shortlist
              </button>
            )}
            <button type="submit" className="btn-primary">
              Use my idea
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
