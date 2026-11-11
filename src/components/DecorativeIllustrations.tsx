import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties, SVGProps } from 'react';

const INK = '#342B2B';

type SvgProps = SVGProps<SVGSVGElement> & { className?: string };

/* ------------------------------------------------------------------ */
/* Screen one: the sleepy sun                                          */
/* ------------------------------------------------------------------ */

export function RisingSun({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

  return (
    <svg viewBox="0 0 320 168" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4DDB0" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#F3E2E1" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F3E2E1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sun-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6DCA9" />
          <stop offset="100%" stopColor="#E7A79F" />
        </linearGradient>
        <clipPath id="sun-horizon">
          <rect x="0" y="0" width="320" height="140" />
        </clipPath>
      </defs>

      <g clipPath="url(#sun-horizon)">
        <motion.g
          initial={reduce ? false : { y: 78 }}
          animate={{ y: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <circle cx="160" cy="140" r="132" fill="url(#sun-glow)" className="anim-shimmer" />
          <g className="anim-spin-slow">
            {rays.map((deg) => (
              <line
                key={deg}
                x1="160"
                y1="74"
                x2="160"
                y2={deg % 60 === 0 ? 58 : 64}
                stroke="#C9A86E"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${deg} 160 140)`}
              />
            ))}
          </g>
          <circle cx="160" cy="140" r="54" fill="url(#sun-fill)" />
          {/* sleepy, content little face */}
          <path d="M139 124 q6 5 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M169 124 q6 5 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="135" cy="133" r="5" fill="#C78C96" opacity="0.45" />
          <circle cx="185" cy="133" r="5" fill="#C78C96" opacity="0.45" />
          <path d="M154 134 q6 5 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </motion.g>
      </g>

      {/* horizon */}
      <path d="M18 140 H302" stroke="#FFF4E8" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M60 152 H96 M140 152 H210 M236 152 H262" stroke="#FFF4E8" strokeWidth="2" strokeLinecap="round" opacity="0.2" />

      {/* two very relaxed birds */}
      <g stroke="#FFF4E8" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55">
        <motion.path
          d="M58 52 q5 -5 10 0 q5 -5 10 0"
          initial={reduce ? false : { x: -14, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2.4, delay: 1 }}
        />
        <motion.path
          d="M246 36 q4 -4 8 0 q4 -4 8 0"
          initial={reduce ? false : { x: 12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2.4, delay: 1.3 }}
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Coffee cup                                                           */
/* ------------------------------------------------------------------ */

export function CoffeeCup({ className }: SvgProps) {
  const steam = (d: string, delay: number) => (
    <path
      d={d}
      stroke="#FFF4E8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
      className="anim-steam"
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    />
  );
  return (
    <svg viewBox="0 0 84 84" className={className} aria-hidden="true" focusable="false">
      {steam('M30 24 q-4 -5 0 -10 q4 -5 0 -10', 0)}
      {steam('M40 22 q-4 -5 0 -10 q4 -5 0 -10', 0.9)}
      {steam('M50 24 q-4 -5 0 -10 q4 -5 0 -10', 1.8)}
      <ellipse cx="40" cy="70" rx="31" ry="6.5" fill="#F4EAD8" stroke={INK} strokeWidth="2" />
      <path d="M60 41 c10 -1 12 13 -1 14" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 34 H61 V47 C61 59 52 66 40 66 C28 66 19 59 19 47 Z" fill="#FFFDF9" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="40" cy="34" rx="21" ry="4" fill="#8A5A44" stroke={INK} strokeWidth="2" />
      <path
        d="M40 55 s-6 -3.6 -6 -7.4 a3.2 3.2 0 0 1 6 -1.4 a3.2 3.2 0 0 1 6 1.4 c0 3.8 -6 7.4 -6 7.4 z"
        fill="#C78C96"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small doodles                                                        */
/* ------------------------------------------------------------------ */

export function HeartDoodle({ className, filled = true, style }: SvgProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        d="M12 20.5s-7.2-4.4-9.4-9A5.3 5.3 0 0 1 12 6.4a5.3 5.3 0 0 1 9.4 5.1c-2.2 4.6-9.4 9-9.4 9z"
        fill={filled ? '#C78C96' : 'none'}
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7 9.6c.5-1 1.3-1.5 2.2-1.6" stroke="#FFFDF9" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

export function SparkleDoodle({ className, color = '#C9A86E', style }: SvgProps & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M12 1.5c.8 5.6 4.9 9.7 10.5 10.5-5.6.8-9.7 4.9-10.5 10.5C11.2 16.9 7.1 12.8 1.5 12 7.1 11.2 11.2 7.1 12 1.5z" fill={color} />
    </svg>
  );
}

export function Squiggle({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 12" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        d="M2 6 q7.5 -6 15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0"
        fill="none"
        stroke="#C78C96"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A small, slightly nervous friend. */
export function NervousBuddy({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 130 132" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="62" cy="122" rx="34" ry="5" fill={INK} opacity="0.08" />
      {/* the flower he's holding, slightly too tightly */}
      <path d="M104 74 L110 40" stroke="#5F7457" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M107 58 q8 -6 12 -2 q-4 6 -12 2z" fill="#A9B8A2" stroke={INK} strokeWidth="1.4" />
      <g transform="translate(110 34)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-7" rx="4.6" ry="7" fill="#F3E2E1" stroke={INK} strokeWidth="1.4" transform={`rotate(${r})`} />
        ))}
        <circle r="3.6" fill="#EAD8B7" stroke={INK} strokeWidth="1.4" />
      </g>
      {/* body */}
      <path
        d="M62 26 C88 26 102 46 102 72 C102 98 86 116 62 116 C38 116 22 99 22 73 C22 46 37 26 62 26 Z"
        fill="#EBCFCF"
        stroke={INK}
        strokeWidth="2.4"
      />
      <path d="M95 80 q10 -2 11 -8" stroke="#FFF4E8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M28 82 q-8 2 -8 9" stroke="#FFF4E8" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* feet */}
      <ellipse cx="48" cy="117" rx="8" ry="4" fill="#EBCFCF" stroke={INK} strokeWidth="2" />
      <ellipse cx="76" cy="117" rx="8" ry="4" fill="#EBCFCF" stroke={INK} strokeWidth="2" />
      {/* worried eyebrows */}
      <path d="M41 56 l10 -3" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M83 56 l-10 -3" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="48" cy="67" rx="3.6" ry="4.6" fill={INK} className="anim-blink" />
      <ellipse cx="76" cy="67" rx="3.6" ry="4.6" fill={INK} className="anim-blink" />
      <circle cx="49.2" cy="65.4" r="1.2" fill="#fff" />
      <circle cx="77.2" cy="65.4" r="1.2" fill="#fff" />
      {/* cheeks */}
      <ellipse cx="38" cy="80" rx="6" ry="3.6" fill="#C78C96" opacity="0.5" />
      <ellipse cx="86" cy="80" rx="6" ry="3.6" fill="#C78C96" opacity="0.5" />
      {/* wobbly smile */}
      <path d="M52 84 q5 -3.4 10 0 t10 0" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* sweat drop */}
      <path d="M93 38 c3 5 5 8 5 10.5 a5 5 0 0 1 -10 0 c0 -2.5 2 -5.5 5 -10.5z" fill="#C9DCE4" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

/** A bowl of something. Doesn't matter what. Making me hungry regardless. */
export function FoodDoodle({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 96 86" className={className} aria-hidden="true" focusable="false">
      <g stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M34 20 q-4 -5 0 -10 q4 -5 0 -10" opacity="0.45" className="anim-steam" />
        <path d="M48 18 q-4 -5 0 -10 q4 -5 0 -10" opacity="0.45" className="anim-steam" style={{ animationDelay: '1s' }} />
        <path d="M62 20 q-4 -5 0 -10 q4 -5 0 -10" opacity="0.45" className="anim-steam" style={{ animationDelay: '2s' }} />
        <path d="M58 8 L84 40" />
        <path d="M66 6 L90 38" />
      </g>
      <path d="M10 40 H86 C86 62 70 76 48 76 C26 76 10 62 10 40 Z" fill="#F4EAD8" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M18 40 c4 -8 10 -4 14 -9 c4 6 10 2 14 -6 c4 8 9 4 13 9 c5 -4 10 0 13 6" fill="#EAD8B7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="30" cy="36" r="3.4" fill="#C78C96" />
      <path d="M58 33 q5 -4 9 0 q-4 4 -9 0z" fill="#A9B8A2" stroke={INK} strokeWidth="1.2" />
      <path d="M30 56 q18 8 36 0" stroke="#C78C96" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="48" cy="80" rx="22" ry="3.2" fill={INK} opacity="0.08" />
    </svg>
  );
}

/** Exhibit A: a man making a website instead of sending a text. */
export function LaptopDoodle({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true" focusable="false">
      <g stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* the guy, behind the laptop */}
        <circle cx="120" cy="44" r="24" fill="#F4EAD8" />
        <path d="M100 30 q8 -14 22 -12 q14 1 19 12" fill="none" />
        <circle cx="112" cy="46" r="2.2" fill={INK} />
        <circle cx="128" cy="46" r="2.2" fill={INK} />
        <path d="M107 38 l8 2 M133 38 l-8 2" />
        <path d="M114 57 q6 -3 12 0" fill="none" />
        <path d="M146 26 c3 5 5 8 5 10.5 a5 5 0 0 1 -10 0 c0 -2.5 2 -5.5 5 -10.5z" fill="#C9DCE4" strokeWidth="1.6" />
        {/* laptop */}
        <rect x="64" y="62" width="112" height="70" rx="8" fill="#FFFDF9" />
        <rect x="72" y="70" width="96" height="54" rx="4" fill="#F3E2E1" strokeWidth="1.6" />
        <path d="M40 140 H200 L188 132 H52 Z" fill="#EAD8B7" />
        {/* code on screen */}
        <path d="M100 88 l-8 8 l8 8 M140 88 l8 8 l-8 8 M126 84 l-12 24" fill="none" strokeWidth="2.4" />
      </g>
      {/* question marks of self-doubt */}
      <g fill={INK} fontFamily="Caveat, cursive" fontSize="26" fontWeight="600">
        <text x="30" y="52" transform="rotate(-14 30 52)">?</text>
        <text x="196" y="40" transform="rotate(12 196 40)">?!</text>
        <text x="206" y="92" fontSize="20" opacity="0.6">?</text>
      </g>
    </svg>
  );
}

/** Ambient floaty bits for backgrounds. Purely decorative. */
export function FloatingBits({ variant = 'soft' }: { variant?: 'soft' | 'question' }) {
  const bits =
    variant === 'question'
      ? [
          { kind: 'sparkle', top: '12%', left: '8%', size: 18, delay: 0, r: -8 },
          { kind: 'heart', top: '22%', left: '88%', size: 16, delay: 1.5, r: 12 },
          { kind: 'sparkle', top: '70%', left: '92%', size: 14, delay: 2.2, r: 0 },
          { kind: 'dot', top: '82%', left: '6%', size: 10, delay: 0.8, r: 0 },
          { kind: 'sparkle', top: '48%', left: '3%', size: 12, delay: 3, r: 10 },
        ]
      : [
          { kind: 'sparkle', top: '16%', left: '86%', size: 14, delay: 0.5, r: 0 },
          { kind: 'dot', top: '74%', left: '8%', size: 9, delay: 1.2, r: 0 },
          { kind: 'sparkle', top: '84%', left: '90%', size: 12, delay: 2, r: 12 },
        ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="anim-bob absolute"
          style={{ top: b.top, left: b.left, animationDelay: `${b.delay}s`, ['--r' as string]: `${b.r}deg` } as CSSProperties}
        >
          {b.kind === 'heart' ? (
            <HeartDoodle style={{ width: b.size, height: b.size }} className="opacity-70" />
          ) : b.kind === 'sparkle' ? (
            <SparkleDoodle style={{ width: b.size, height: b.size }} className="opacity-80" />
          ) : (
            <span className="block rounded-full bg-rose/40" style={{ width: b.size, height: b.size }} />
          )}
        </span>
      ))}
    </div>
  );
}
