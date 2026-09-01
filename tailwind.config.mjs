/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1ECE1',      // warm stone — base ground
        'paper-alt': '#E7DFCE', // deeper stone — banded sections
        ink: '#17140F',         // near-black warm text
        'ink-soft': '#57503F',  // muted brown-gray secondary text
        amber: '#C77D22',       // ochre accent — status: in progress, links
        moss: '#4B5D3A',        // olive accent — status: live, secondary marks
        line: '#D2C7AE',        // hairline / border color
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        wrap: '72rem',
      },
      letterSpacing: {
        tightest: '-0.045em',
        widest2: '0.22em',
      },
    },
  },
  plugins: [],
};
