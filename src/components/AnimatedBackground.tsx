import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { ScreenId } from '../lib/plan';

/**
 * The sky. The whole site quietly moves from sunrise (the greeting) to a
 * Sunday-evening night sky (the plan).
 */
interface Sky {
  top: string;
  mid: string;
  bottom: string;
  orbA: string;
  orbB: string;
  stars: number;
}

const SKIES: Record<ScreenId, Sky> = {
  morning: { top: '#1C1428', mid: '#5B2F4D', bottom: '#E8936F', orbA: '#FFB38A', orbB: '#E58FA0', stars: 0.35 },
  panic: { top: '#171220', mid: '#2E1F38', bottom: '#4A2B45', orbA: '#E58FA0', orbB: '#8FD3C1', stars: 0.4 },
  intro: { top: '#1A1220', mid: '#35203A', bottom: '#5E2E48', orbA: '#F2C77B', orbB: '#E58FA0', stars: 0.4 },
  question: { top: '#1D1020', mid: '#46203C', bottom: '#7A3550', orbA: '#E58FA0', orbB: '#FFB38A', stars: 0.5 },
  food: { top: '#140E18', mid: '#24162A', bottom: '#3B2232', orbA: '#FFB38A', orbB: '#F2C77B', stars: 0.45 },
  time: { top: '#120E1C', mid: '#221A33', bottom: '#3A2440', orbA: '#F2C77B', orbB: '#8FA8E0', stars: 0.7 },
  plan: { top: '#0F0C18', mid: '#1E1630', bottom: '#3A2238', orbA: '#F2C77B', orbB: '#E58FA0', stars: 1 },
  declined: { top: '#151019', mid: '#231A2B', bottom: '#33243A', orbA: '#8FD3C1', orbB: '#F2C77B', stars: 0.5 },
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AnimatedBackground({ screen }: { screen: ScreenId }) {
  const s = SKIES[screen];
  const fade = { duration: 1.4, ease: 'easeInOut' } as const;

  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        top: `${(i * 37) % 100}%`,
        left: `${(i * 61 + 13) % 100}%`,
        size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
        delay: `${(i * 0.37) % 4}s`,
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ background: `linear-gradient(180deg, ${s.top} 0%, ${s.mid} 55%, ${s.bottom} 100%)` }}
        transition={fade}
      />
      <motion.div
        className="anim-drift-a absolute -left-[25%] -top-[20%] h-[75vmax] w-[75vmax] rounded-full opacity-30 blur-[90px]"
        initial={false}
        animate={{ backgroundColor: s.orbA }}
        transition={fade}
      />
      <motion.div
        className="anim-drift-b absolute -bottom-[30%] -right-[25%] h-[80vmax] w-[80vmax] rounded-full opacity-25 blur-[100px]"
        initial={false}
        animate={{ backgroundColor: s.orbB }}
        transition={fade}
      />
      <motion.div className="absolute inset-0" initial={false} animate={{ opacity: s.stars }} transition={fade}>
        {stars.map((st, i) => (
          <span
            key={i}
            className="anim-twinkle absolute rounded-full bg-cream"
            style={{ top: st.top, left: st.left, width: st.size, height: st.size, animationDelay: st.delay }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}
