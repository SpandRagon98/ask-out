import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { SparkleDoodle } from './DecorativeIllustrations';

const COLORS = ['#C9A86E', '#C78C96', '#EAD8B7', '#9B5563', '#A9B8A2'];

/** A small, polite burst of sparkles. Not confetti. We're not animals. */
export function SparkleBurst({ count = 16 }: { count?: number }) {
  const reduce = useReducedMotion();
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 70 + Math.random() * 110;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.8,
          size: 8 + Math.random() * 12,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.12,
          rotate: Math.random() * 180,
        };
      }),
    [count],
  );

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ marginLeft: -b.size / 2, marginTop: -b.size / 2 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: b.y, scale: [0, 1.15, 0.6], opacity: [1, 1, 0], rotate: b.rotate }}
          transition={{ duration: 1.1, delay: b.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <SparkleDoodle color={b.color} style={{ width: b.size, height: b.size }} />
        </motion.span>
      ))}
    </div>
  );
}
