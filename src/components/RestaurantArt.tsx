import { useState } from 'react';
import type { IllustrationKind, Restaurant } from '../data/restaurants';

const INK = '#342B2B';

/**
 * Hand-drawn, representative artwork. These are deliberately illustrations,
 * not photos, so nobody mistakes them for the restaurant's real food.
 */
export function Illustration({ kind, className }: { kind: IllustrationKind | 'custom'; className?: string }) {
  switch (kind) {
    case 'dosa':
      return <DosaScene className={className} />;
    case 'pasta':
      return <PastaScene className={className} />;
    case 'dessert':
      return <DessertScene className={className} />;
    default:
      return <MysteryScene className={className} />;
  }
}

/** First photo that loads, otherwise the illustration. */
export function RestaurantImage({ restaurant, className = '' }: { restaurant: Restaurant; className?: string }) {
  const [tries, setTries] = useState(0);
  const photo = restaurant.photos[tries];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {photo ? (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setTries((t) => t + 1)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div role="img" aria-label={restaurant.illustrationAlt} className="h-full w-full">
          <Illustration kind={restaurant.illustration} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

function DosaScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dosa-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4EAD8" />
          <stop offset="1" stopColor="#EAD8B7" />
        </linearGradient>
        <linearGradient id="dosa-crisp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E7B76A" />
          <stop offset="0.55" stopColor="#D69A4E" />
          <stop offset="1" stopColor="#B8783A" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dosa-bg)" />
      <circle cx="340" cy="40" r="70" fill="#FFFDF9" opacity="0.35" />
      {/* banana leaf */}
      <g transform="rotate(-12 200 160)">
        <path d="M-10 120 C90 70 300 60 420 110 L420 230 C300 260 90 250 -10 210 Z" fill="#8FA886" />
        <path d="M-10 165 C120 150 290 150 420 168" stroke="#6E8A66" strokeWidth="4" fill="none" />
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={`M${10 + i * 34} 158 q14 -40 32 -70 M${10 + i * 34} 166 q14 40 32 66`}
            stroke="#7E9A76"
            strokeWidth="1.6"
            fill="none"
            opacity="0.7"
          />
        ))}
      </g>
      {/* two idlis, minding their own business */}
      {[
        { cx: 92, cy: 112 },
        { cx: 150, cy: 96 },
      ].map((d, i) => (
        <g key={i}>
          <ellipse cx={d.cx + 3} cy={d.cy + 8} rx="34" ry="13" fill={INK} opacity="0.12" />
          <ellipse cx={d.cx} cy={d.cy} rx="34" ry="20" fill="#FBF8F0" stroke={INK} strokeWidth="2.2" />
          <ellipse cx={d.cx - 6} cy={d.cy - 6} rx="18" ry="7" fill="#fff" opacity="0.9" />
          {[[-12, 4], [4, 8], [14, -2], [-2, -2]].map(([x, y], j) => (
            <circle key={j} cx={d.cx + x} cy={d.cy + y} r="1.3" fill="#D9CFBC" />
          ))}
        </g>
      ))}
      {/* the masala dosa, folded, ambitious */}
      <g transform="rotate(-10 250 160)">
        <ellipse cx="250" cy="196" rx="132" ry="14" fill={INK} opacity="0.14" />
        <path
          d="M118 188 C150 120 330 112 386 176 C388 186 380 194 368 194 L128 198 C118 198 114 194 118 188 Z"
          fill="url(#dosa-crisp)"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M150 168 C200 136 300 132 360 168" stroke="#F6D79C" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
        {[
          [170, 176, 5, 2.4], [196, 160, 7, 3], [228, 150, 4, 2], [258, 146, 8, 3], [292, 150, 5, 2.4],
          [320, 160, 7, 3], [346, 172, 4, 2], [214, 176, 6, 2.4], [276, 170, 5, 2.2], [310, 182, 6, 2.4],
        ].map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#A86A2E" opacity="0.4" />
        ))}
        {/* potato masala peeking out of the end */}
        <path d="M368 194 C384 192 392 180 386 172 C378 178 372 186 368 194 Z" fill="#E9C24C" stroke={INK} strokeWidth="1.8" />
        <circle cx="381" cy="180" r="1.6" fill="#5F7457" />
      </g>
      {/* katoris */}
      {[
        { cx: 92, cy: 236, fill: '#F6F1E4' },
        { cx: 178, cy: 252, fill: '#C9763E' },
        { cx: 264, cy: 244, fill: '#C8574A' },
      ].map((b, i) => (
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy + 6} rx="38" ry="12" fill={INK} opacity="0.12" />
          <ellipse cx={b.cx} cy={b.cy} rx="36" ry="22" fill="#D9D5CD" stroke={INK} strokeWidth="2.2" />
          <ellipse cx={b.cx} cy={b.cy - 2} rx="29" ry="16" fill={b.fill} />
          <ellipse cx={b.cx - 8} cy={b.cy - 7} rx="9" ry="3" fill="#fff" opacity="0.35" />
        </g>
      ))}
      {/* mustard seeds & curry leaves */}
      {[[86, 232], [96, 238], [80, 240], [180, 248], [270, 240]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={INK} opacity="0.7" />
      ))}
      <path d="M318 214 q16 -14 28 -2 q-14 14 -28 2z" fill="#5F7457" stroke={INK} strokeWidth="1.6" />
      <path d="M332 232 q14 -16 28 -6 q-12 16 -28 6z" fill="#6E8A66" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

function PastaScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gingham" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill="#F8EEEC" />
          <rect width="18" height="36" fill="#C78C96" opacity="0.22" />
          <rect width="36" height="18" fill="#C78C96" opacity="0.22" />
        </pattern>
        <radialGradient id="plate" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1ECE4" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#gingham)" />
      {/* plate */}
      <ellipse cx="196" cy="166" rx="132" ry="110" fill={INK} opacity="0.1" />
      <ellipse cx="190" cy="156" rx="132" ry="110" fill="url(#plate)" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="190" cy="156" rx="96" ry="78" fill="none" stroke={INK} strokeWidth="1.2" opacity="0.18" />
      {/* spaghetti nest */}
      <g fill="none" strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => (
          <ellipse
            key={i}
            cx={190 + Math.sin(i) * 6}
            cy={152 + Math.cos(i) * 4}
            rx={70 - i * 6}
            ry={54 - i * 5}
            stroke={i % 2 ? '#E7C36A' : '#F0D488'}
            strokeWidth="7"
            transform={`rotate(${i * 22} 190 152)`}
          />
        ))}
        <path d="M140 150 q50 -40 100 0" stroke="#E7C36A" strokeWidth="7" />
        <path d="M150 176 q40 20 84 -6" stroke="#F0D488" strokeWidth="7" />
      </g>
      {/* sauce + basil */}
      <path d="M166 128 c14 -14 40 -10 46 4 c8 16 -8 30 -26 28 c-18 -2 -30 -18 -20 -32 z" fill="#C2523F" stroke={INK} strokeWidth="2" />
      <circle cx="176" cy="136" r="4" fill="#E07A62" />
      <circle cx="196" cy="146" r="3" fill="#E07A62" />
      <path d="M204 118 q22 -18 38 -4 q-18 18 -38 4z" fill="#6E9A5E" stroke={INK} strokeWidth="1.8" />
      <path d="M206 118 q14 -4 32 -4" stroke="#4F7A43" strokeWidth="1.4" fill="none" />
      <path d="M150 160 q4 -24 26 -26 q-2 22 -26 26z" fill="#7FA86E" stroke={INK} strokeWidth="1.8" />
      {/* parmesan specks */}
      {[[220, 150], [228, 164], [160, 174], [206, 178], [174, 118]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="3" rx="1" fill="#FFF7DC" />
      ))}
      {/* fork */}
      <g transform="rotate(18 352 170)">
        <rect x="346" y="150" width="9" height="130" rx="4.5" fill="#D9D5CD" stroke={INK} strokeWidth="2" />
        <path d="M336 60 v56 q0 22 14 30 q14 -8 14 -30 v-56" fill="#D9D5CD" stroke={INK} strokeWidth="2" />
        <path d="M343 60 v46 M350 60 v46 M357 60 v46" stroke={INK} strokeWidth="1.8" />
      </g>
      {/* tiny vase */}
      <g transform="translate(40 30)">
        <path d="M14 58 c-10 -16 -6 -30 6 -34 h8 c12 4 16 18 6 34 z" fill="#A9B8A2" stroke={INK} strokeWidth="2" />
        <path d="M24 24 V0" stroke="#5F7457" strokeWidth="2" />
        <circle cx="24" cy="-4" r="7" fill="#C78C96" stroke={INK} strokeWidth="1.6" />
        <path d="M24 12 q10 -8 16 -2" stroke="#5F7457" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

function DessertScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lamp-glow" cx="50%" cy="20%" r="70%">
          <stop offset="0" stopColor="#F6DCA9" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#C99A6B" stopOpacity="0.25" />
          <stop offset="1" stopColor="#3E3232" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A3B3A" />
          <stop offset="1" stopColor="#3A2F2E" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wall)" />
      <rect width="400" height="300" fill="url(#lamp-glow)" />
      {/* pendant lamp */}
      <path d="M200 0 V40" stroke="#EAD8B7" strokeWidth="2" opacity="0.7" />
      <path d="M170 64 q30 -34 60 0 z" fill="#C9A86E" stroke="#1F1919" strokeWidth="2" />
      <ellipse cx="200" cy="66" rx="12" ry="4" fill="#FFF4D6" />
      {/* table */}
      <ellipse cx="200" cy="246" rx="210" ry="64" fill="#7A5A48" />
      <ellipse cx="200" cy="240" rx="206" ry="58" fill="#8E6B55" />
      {/* plate + cake slice */}
      <ellipse cx="160" cy="232" rx="78" ry="22" fill="#F4EEE4" stroke="#1F1919" strokeWidth="2" />
      <g stroke="#1F1919" strokeWidth="2" strokeLinejoin="round">
        <path d="M108 226 L156 150 L214 220 Z" fill="#F4EAD8" />
        <path d="M108 226 L214 220 L214 196 L108 202 Z" fill="#EAD8B7" />
        <path d="M108 214 L214 208" stroke="#C78C96" strokeWidth="5" />
        <path d="M108 202 L156 150 L214 196 Z" fill="#FFF8EC" />
        <path d="M156 150 q-6 -4 -2 -10 q6 2 2 10z" fill="#5F7457" strokeWidth="1.4" />
      </g>
      <circle cx="156" cy="144" r="9" fill="#B6475B" stroke="#1F1919" strokeWidth="2" />
      <circle cx="153" cy="141" r="2.4" fill="#fff" opacity="0.6" />
      {/* coffee */}
      <ellipse cx="292" cy="226" rx="40" ry="11" fill="#F4EEE4" stroke="#1F1919" strokeWidth="2" />
      <path d="M266 190 H318 V206 C318 220 306 226 292 226 C278 226 266 220 266 206 Z" fill="#FFFDF9" stroke="#1F1919" strokeWidth="2" />
      <path d="M318 196 c12 0 12 16 0 16" stroke="#1F1919" strokeWidth="2" fill="none" />
      <ellipse cx="292" cy="190" rx="26" ry="5" fill="#6B4433" stroke="#1F1919" strokeWidth="2" />
      <path d="M284 182 q-4 -6 0 -12 M298 180 q-4 -6 0 -12" stroke="#EAD8B7" strokeWidth="2" fill="none" strokeLinecap="round" className="anim-steam" opacity="0.6" />
      {/* candle */}
      <circle cx="360" cy="160" r="30" fill="#F6DCA9" opacity="0.18" />
      <rect x="352" y="170" width="16" height="44" rx="3" fill="#F4EAD8" stroke="#1F1919" strokeWidth="2" />
      <path d="M360 152 c6 8 6 14 0 18 c-6 -4 -6 -10 0 -18z" fill="#F6B860" className="anim-flicker" />
      {/* string lights */}
      <path d="M0 22 q100 40 200 18 t200 10" stroke="#EAD8B7" strokeWidth="1.2" fill="none" opacity="0.4" />
      {[30, 80, 130, 260, 310, 360].map((x, i) => (
        <circle key={x} cx={x} cy={i < 3 ? 30 + i * 6 : 40 - (i - 3) * 2} r="3.2" fill="#F6DCA9" className="anim-shimmer" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </svg>
  );
}

function MysteryScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mystery-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3E9DE" />
          <stop offset="1" stopColor="#F4EAD8" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#mystery-bg)" />
      <ellipse cx="204" cy="162" rx="110" ry="92" fill={INK} opacity="0.08" />
      <ellipse cx="200" cy="154" rx="110" ry="92" fill="#FFFDF9" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="200" cy="154" rx="80" ry="66" fill="none" stroke={INK} strokeWidth="1.2" opacity="0.2" />
      <path d="M176 128 q0 -26 26 -26 q26 0 26 22 q0 16 -20 22 q-8 3 -8 14 v6" fill="none" stroke="#C78C96" strokeWidth="9" strokeLinecap="round" />
      <circle cx="200" cy="196" r="6" fill="#C78C96" />
      <g stroke={INK} strokeWidth="2" fill="#D9D5CD">
        <rect x="58" y="80" width="9" height="150" rx="4.5" />
        <rect x="334" y="80" width="12" height="150" rx="6" />
      </g>
      <path d="M340 80 q14 30 0 70" fill="#D9D5CD" stroke={INK} strokeWidth="2" />
      <path d="M56 80 v32 M62 80 v32 M68 80 v32" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}
