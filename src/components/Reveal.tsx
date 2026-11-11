import { motion, useReducedMotion } from 'motion/react';
import { createContext, forwardRef, useContext, type ReactNode } from 'react';

/**
 * Multiplier for every reveal delay. The first visit to a screen plays at 1;
 * coming back to a screen you've already read plays almost instantly.
 */
export const RevealTempo = createContext(1);

const TAGS = {
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  div: motion.div,
  span: motion.span,
} as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds. Ignored when the reader prefers reduced motion. */
  delay?: number;
  as?: keyof typeof TAGS;
  className?: string;
  id?: string;
  tabIndex?: number;
  'data-screen-heading'?: boolean;
}

/** One "beat" of text: fades and lifts in, like a message arriving. */
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  { children, delay = 0, as = 'p', className, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  const tempo = useContext(RevealTempo);
  const Tag = TAGS[as] as typeof motion.div;
  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : delay * tempo, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
});
