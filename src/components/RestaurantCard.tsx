import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, MapPin, Navigation } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { mapsUrl, type Restaurant } from '../data/restaurants';
import { Illustration } from './RestaurantArt';

interface Props {
  restaurant: Restaurant;
  selected: boolean;
  active: boolean;
  onSelect: () => void;
  index: number;
  total: number;
}

export function RestaurantCard({ restaurant: r, selected, active, onSelect, index, total }: Props) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const photos = useMemo(() => r.photos.filter((_, i) => !failed.has(i)), [r.photos, failed]);
  const [shown, setShown] = useState(0);
  const current = photos.length ? shown % photos.length : 0;

  // Gentle slideshow on the card she's looking at.
  useEffect(() => {
    if (!active || reduce || photos.length < 2) return;
    const id = window.setInterval(() => setShown((s) => s + 1), 4200);
    return () => window.clearInterval(id);
  }, [active, reduce, photos.length, shown]);

  const step = (d: number) => setShown((s) => (s + d + photos.length) % photos.length);

  return (
    <motion.article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${r.name}`}
      className={[
        'relative h-full overflow-hidden rounded-[1.75rem] bg-plum transition-shadow duration-300',
        selected ? 'shadow-ring' : 'shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/10',
      ].join(' ')}
      animate={selected && !reduce ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* photos */}
      <div className="absolute inset-0">
        {photos.length ? (
          <AnimatePresence initial={false}>
            <motion.img
              key={photos[current].src}
              src={photos[current].src}
              alt={photos[current].alt}
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
              onError={() => {
                const original = r.photos.indexOf(photos[current]);
                setFailed((f) => new Set(f).add(original));
              }}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6 }, scale: { duration: reduce ? 0 : 5, ease: 'linear' } }}
            />
          </AnimatePresence>
        ) : (
          <div role="img" aria-label={r.illustrationAlt} className="h-full w-full">
            <Illustration kind={r.illustration} className="h-full w-full" />
          </div>
        )}
        {/* preload the rest so the slideshow doesn't flash */}
        <div className="hidden" aria-hidden="true">
          {photos.map((p) => (
            <img key={p.src} src={p.src} alt="" referrerPolicy="no-referrer" loading="lazy" />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,24,0.55)_0%,rgba(20,14,24,0)_22%,rgba(20,14,24,0)_38%,rgba(20,14,24,0.88)_72%,rgba(20,14,24,0.97)_100%)]" />
      </div>

      {/* story-style photo bars + tap zones */}
      {photos.length > 1 && (
        <>
          <div className="absolute inset-x-4 top-3 z-10 flex gap-1" aria-hidden="true">
            {photos.map((p, i) => (
              <span key={p.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                <span
                  className={`block h-full rounded-full bg-cream transition-all duration-500 ${i <= current ? 'w-full' : 'w-0'}`}
                />
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => step(-1)}
            className="absolute left-0 top-0 z-10 h-[55%] w-[35%]"
            aria-label={`Previous photo of ${r.name}`}
          />
          <button
            type="button"
            onClick={() => step(1)}
            className="absolute right-0 top-0 z-10 h-[55%] w-[65%]"
            aria-label={`Next photo of ${r.name}`}
          />
        </>
      )}

      <span className="absolute left-4 top-6 z-10 rounded-full bg-night/55 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur-md">
        {r.cuisine}
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute right-4 top-6 z-10 grid h-9 w-9 place-items-center rounded-full bg-gold text-plum-deep shadow-glow"
        initial={false}
        animate={{ scale: selected ? 1 : 0, rotate: selected ? 0 : -60, opacity: selected ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      >
        <Check className="h-5 w-5" strokeWidth={3} />
      </motion.span>

      {/* text + actions */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 tiny:p-4">
        <p className="flex items-center gap-1.5 text-[0.8rem] font-medium text-cream/70">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {r.location}
        </p>
        <h2 className="mt-1 font-display text-[clamp(1.9rem,min(8vw,4.6dvh),2.5rem)] font-medium leading-none tracking-[-0.02em]">
          {r.name}
        </h2>
        <p className="mt-2 font-display text-[1.02rem] italic text-gold-soft">“{r.tagline}”</p>
        <p className="mt-1.5 text-[0.88rem] leading-snug text-cream/70 tiny:hidden">{r.line}</p>

        <div className="mt-4 flex items-center gap-2 tiny:mt-3">
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={[
              'flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.96]',
              selected ? 'bg-gold text-plum-deep' : 'bg-cream text-plum-deep hover:bg-white',
            ].join(' ')}
          >
            {selected && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
            {r.cta}
          </button>
          <a
            href={mapsUrl(r)}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-cream backdrop-blur-md transition hover:bg-white/20"
            aria-label={`Open ${r.name} in Google Maps (new tab)`}
          >
            <Navigation className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-2 text-right text-[0.62rem] text-cream/40">Photos: {r.photoCredit}</p>
      </div>
    </motion.article>
  );
}
