import { motion } from 'motion/react';
import { CalendarHeart, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { getRestaurant } from '../data/restaurants';
import { summarisePlace, summariseTime, type PlanState, type ScreenId } from '../lib/plan';
import { useScreenHeading } from '../lib/hooks';
import { HeartDoodle } from './DecorativeIllustrations';
import { Illustration, RestaurantImage } from './RestaurantArt';
import { Reveal } from './Reveal';
import { SparkleBurst } from './SparkleBurst';
import { useSay } from './Toast';
import { WhatsAppShare } from './WhatsAppShare';

interface Props {
  plan: PlanState;
  onEdit: (screen: ScreenId) => void;
}

const HEART_LINES = ["Arre, it's just a heart. Relax 😂", 'Okay, two hearts. Still chill.', 'Now you are just testing me.'];

export function FinalConfirmation({ plan, onEdit }: Props) {
  const say = useSay();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [pops, setPops] = useState(0);

  const place = summarisePlace(plan);
  const time = summariseTime(plan);
  const restaurant = place.kind === 'listed' ? getRestaurant(place.id) : undefined;

  const placeName = place.kind === 'undecided' ? 'Somewhere nice' : place.name;
  const placeNote =
    place.kind === 'listed'
      ? restaurant?.location
      : place.kind === 'custom'
        ? 'Your idea. Better than mine, probably.'
        : "We'll pick it together";
  const timeText =
    time.kind === 'slot' ? `Around ${time.display}` : time.kind === 'custom' ? time.display : "Time: we'll figure it out";

  return (
    <section className="scene max-w-md" aria-labelledby="plan-title">
      <SparkleBurst count={18} />
      <header className="shrink-0 pt-1 text-center">
        <Reveal delay={0.05} className="text-[0.95rem] text-cream/60">
          Okay then.
        </Reveal>
        <Reveal
          as="h1"
          id="plan-title"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          delay={0.2}
          className="font-display text-[clamp(1.9rem,min(8.6vw,5dvh),3rem)] font-medium leading-[1.05] tracking-[-0.02em]"
        >
          Sounds like a <span className="italic text-glow">plan :)</span>
        </Reveal>
      </header>

      {/* the ticket */}
      <Reveal as="div" delay={0.45} className="relative mt-3 flex min-h-0 flex-1 flex-col tiny:mt-2">
        <div className="glass relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem]">
          <div className="relative min-h-[4.5rem] flex-1">
            {restaurant ? (
              <RestaurantImage restaurant={restaurant} className="absolute inset-0 h-full w-full" />
            ) : (
              <div role="img" aria-label="Illustration of a plate with a question mark on it" className="absolute inset-0">
                <Illustration kind="custom" className="h-full w-full" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/80 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/60 px-3 py-1 text-[0.7rem] font-semibold text-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold anim-shimmer" aria-hidden="true" />
              Pencilled in · official once you reply
            </span>
          </div>

          {/* perforation */}
          <div className="relative h-0" aria-hidden="true">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-night" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-night" />
            <span className="absolute inset-x-5 top-0 border-t border-dashed border-white/20" />
          </div>

          <div className="shrink-0 px-5 pb-4 pt-4 tiny:pb-3 tiny:pt-3">
            <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-gold">
              <CalendarHeart className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Date: </span>
              <span>Sunday · 15 November</span>
            </div>
            <p className="mt-1.5 font-display text-[clamp(1.6rem,min(7vw,4.2dvh),2.2rem)] font-medium leading-tight tracking-[-0.01em] [overflow-wrap:anywhere]">
              <span className="sr-only">Place: </span>
              {placeName}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.88rem] text-cream/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{placeNote}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Time: </span>
                <span>{timeText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* sticker */}
        <motion.p
          aria-hidden="true"
          className="absolute -right-1 bottom-[6.5rem] z-10 max-w-[9.5rem] rotate-[6deg] rounded-lg bg-gold-soft px-2.5 py-1.5 text-center font-hand text-[1.05rem] leading-[1.05] text-plum-deep shadow-glow tiny:hidden"
          initial={{ opacity: 0, scale: 1.6, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 400, damping: 16 }}
        >
          could've just texted. but here we are.
        </motion.p>
      </Reveal>

      <div className="shrink-0 pt-3 text-center tiny:pt-2">
        <Reveal delay={0.9} className="text-[0.98rem] text-cream/85">
          I'll take care of the rest. You just show up hungry.
        </Reveal>
        <Reveal as="div" delay={1.3} className="mt-0.5 flex items-center justify-center gap-1">
          <span className="hand text-[1.3rem]">You bring the panic, I'll bring the chill.</span>
        </Reveal>
        <Reveal as="div" delay={1.6} className="flex items-center justify-center gap-1">
          <span className="font-hand text-[1.7rem] leading-none text-cream">— Spandan</span>
          <motion.button
            type="button"
            aria-label="A tiny heart"
            className="grid h-10 w-10 place-items-center rounded-full"
            initial={false}
            animate={{ scale: pops ? [1, 1.5, 0.9, 1] : 1, rotate: pops % 2 ? [0, -14, 8, 0] : [0, 14, -8, 0] }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              setPops((p) => p + 1);
              say(HEART_LINES[Math.min(pops, HEART_LINES.length - 1)]);
            }}
          >
            <HeartDoodle className="h-5 w-5" />
          </motion.button>
        </Reveal>
      </div>

      <Reveal as="div" delay={1.9} className="shrink-0 pb-3 pt-1">
        <WhatsAppShare plan={plan} onEdit={onEdit} />
      </Reveal>
    </section>
  );
}
