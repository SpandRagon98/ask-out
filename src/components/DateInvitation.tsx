import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useContext, useState } from 'react';
import { NervousBuddy } from './DecorativeIllustrations';
import { PlayfulNoButton } from './PlayfulNoButton';
import { Reveal, RevealTempo } from './Reveal';
import { SparkleBurst } from './SparkleBurst';
import { useSay } from './Toast';
import { tap, useScreenHeading } from '../lib/hooks';

interface Props {
  saidYes: boolean;
  onYes: () => void;
  onDecline: () => void;
  onNext: () => void;
}

export function DateInvitation({ saidYes, onYes, onDecline, onNext }: Props) {
  const [burst, setBurst] = useState(0);

  return (
    <section data-dodge-bounds className="scene max-w-2xl text-center" aria-label="The question">
      {burst > 0 && <SparkleBurst key={burst} count={22} />}
      <AnimatePresence mode="wait" initial={false}>
        {saidYes ? (
          <YesState key="yes" onNext={onNext} />
        ) : (
          <QuestionState
            key="question"
            onYes={() => {
              tap(18);
              setBurst((b) => b + 1);
              onYes();
            }}
            onDecline={onDecline}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function QuestionState({ onYes, onDecline }: { onYes: () => void; onDecline: () => void }) {
  const say = useSay();
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [wobble, setWobble] = useState(0);

  return (
    <motion.div
      className="flex h-full flex-col"
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <motion.button
          type="button"
          aria-label="The nervous little guy"
          onClick={() => {
            setWobble((w) => w + 1);
            say('Yes, this is a little awkward.');
          }}
          className="mb-2 rounded-full p-1"
          initial={false}
          animate={{ rotate: wobble % 2 ? [0, -8, 7, -4, 0] : [0, 8, -7, 4, 0] }}
          transition={{ duration: 0.5 }}
        >
          <NervousBuddy className="h-[min(6.5rem,13dvh)] w-[min(6.5rem,13dvh)]" />
        </motion.button>

        <Reveal delay={0.1} className="text-[1.02rem] text-cream/75">
          Okay, Madamji. <span className="eyebrow ml-1 align-middle">One question</span>
        </Reveal>

        <Reveal
          as="h1"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          delay={0.5}
          className="mx-auto mt-4 max-w-[13ch] font-display text-[clamp(2.3rem,min(10.5vw,7dvh),4.6rem)] font-medium leading-[1.02] tracking-[-0.025em] text-balance"
        >
          Would you like to go out with me this <span className="italic text-glow">Sunday?</span>
        </Reveal>

        <Reveal as="div" delay={1.1} className="mt-6 flex flex-wrap justify-center gap-2 tiny:mt-4">
          {['15 November', 'Evening, 5–7-ish', 'Your time, your call', 'Food: obviously'].map((c) => (
            <span key={c} className="glass rounded-full px-3.5 py-1.5 text-[0.85rem] font-medium text-cream/85">
              {c}
            </span>
          ))}
        </Reveal>
      </div>

      <Reveal as="div" delay={1.6} className="shrink-0 pb-3">
        <div className="flex items-center justify-center gap-3">
          <motion.button
            type="button"
            className="btn-primary min-w-0 flex-1 basis-auto px-5 sm:flex-none sm:px-8"
            onClick={onYes}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            Okay, let's do it :)
          </motion.button>
          <PlayfulNoButton onDecline={onDecline} />
        </div>
        <button type="button" className="btn-link mt-1" onClick={onDecline}>
          Maybe another day
        </button>
      </Reveal>
    </motion.div>
  );
}

function YesState({ onNext }: { onNext: () => void }) {
  const reduce = useReducedMotion();
  const tempo = useContext(RevealTempo);
  const heading = useScreenHeading<HTMLHeadingElement>();
  const letters = 'FOOD.'.split('');

  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <Reveal
          as="h1"
          ref={heading}
          tabIndex={-1}
          data-screen-heading
          delay={0.2}
          className="font-display text-[clamp(2.4rem,min(11vw,7dvh),4.4rem)] font-medium leading-none tracking-[-0.02em]"
        >
          Achha <span className="italic text-glow">ji.</span>
        </Reveal>
        <Reveal delay={0.6} className="mt-2 text-[1.1rem] text-cream/70">
          Look at that.
        </Reveal>

        <Reveal delay={1.2} className="mt-6 text-[1.08rem] tiny:mt-4">
          I was trying to be <em className="font-display">very</em> chill about this.
        </Reveal>
        <Reveal delay={1.7} className="mt-1 text-[1.08rem] text-cream/70">
          Anyway. Now for the important part.
        </Reveal>

        <Reveal delay={2.2} className="hand mt-5 text-[1.25rem] tiny:mt-3">
          (dramatic pause)
        </Reveal>
        <h2
          className="flex justify-center font-display text-[clamp(4.5rem,min(26vw,17dvh),10rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
          aria-label="Food."
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={ch === '.' ? 'text-gold' : 'text-glow'}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -70, rotate: i % 2 ? 10 : -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={
                reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 520, damping: 14, delay: (2.7 + i * 0.12) * tempo }
              }
            >
              {ch}
            </motion.span>
          ))}
        </h2>
      </div>

      <Reveal as="div" delay={3.4} className="flex shrink-0 justify-center pb-4">
        <motion.button type="button" className="btn-primary w-full max-w-xs" onClick={onNext} whileTap={{ scale: 0.96 }}>
          Okay, show me the food <span aria-hidden="true">→</span>
        </motion.button>
      </Reveal>
    </motion.div>
  );
}
