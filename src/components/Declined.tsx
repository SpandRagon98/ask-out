import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CoffeeCup } from './DecorativeIllustrations';
import { Reveal } from './Reveal';
import { useScreenHeading } from '../lib/hooks';

export function Declined({ onRestart }: { onRestart: () => void }) {
  const heading = useScreenHeading<HTMLHeadingElement>();
  const [sips, setSips] = useState(0);

  return (
    <section className="scene max-w-md justify-center text-center" aria-labelledby="declined-title">
      <Reveal as="div" className="mx-auto">
        <motion.button
          type="button"
          aria-label="A cup of chai"
          onClick={() => setSips((s) => s + 1)}
          whileTap={{ scale: 0.9, rotate: -8 }}
          className="rounded-full p-2"
        >
          <CoffeeCup className="h-24 w-24" />
        </motion.button>
      </Reveal>
      <Reveal
        as="h1"
        id="declined-title"
        ref={heading}
        tabIndex={-1}
        data-screen-heading
        delay={0.2}
        className="mt-4 font-display text-[clamp(2.2rem,min(9vw,6dvh),3.2rem)] font-medium leading-tight tracking-[-0.02em]"
      >
        Achha, no <span className="italic text-glow">worries :)</span>
      </Reveal>
      <Reveal delay={0.6} className="mt-3 text-[1.05rem] text-cream/75">
        Thought I'd ask. No pressure at all.
      </Reveal>
      <Reveal delay={1} className="hand mt-3 text-[1.4rem]">
        {sips === 0 ? 'Still chill. Sipping chai about it.' : sips < 3 ? 'Very chill. Extremely unbothered.' : 'Okay, maybe a little bothered. Kidding 😂'}
      </Reveal>
      <Reveal as="div" delay={1.4} className="mt-8">
        <button type="button" className="btn-glass" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Back to the beginning
        </button>
      </Reveal>
    </section>
  );
}
