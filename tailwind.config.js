/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Height-based breakpoints so every screen fits without scrolling.
        short: { raw: '(max-height: 760px)' },
        tiny: { raw: '(max-height: 640px)' },
      },
      colors: {
        night: '#140E18',
        plum: { DEFAULT: '#2A1830', deep: '#1E1222', soft: '#3D2442' },
        wine: '#5A2440',
        rose: { DEFAULT: '#E58FA0', soft: '#F2B8C2', deep: '#C2627A' },
        peach: { DEFAULT: '#FFB38A', soft: '#FFD3B8' },
        gold: { DEFAULT: '#F2C77B', soft: '#F8DFAE' },
        cream: { DEFAULT: '#FFF4E8', dim: '#E9D9CC' },
        chill: '#8FD3C1',
        panic: '#FF7A6B',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', '"DM Sans"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', '"Segoe Print"', 'cursive'],
      },
      boxShadow: {
        glass: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(255,244,232,0.25), 0 10px 40px -8px rgba(255,179,138,0.55)',
        ring: '0 0 0 2px #F2C77B, 0 18px 50px -14px rgba(242,199,123,0.6)',
      },
    },
  },
  plugins: [],
};
