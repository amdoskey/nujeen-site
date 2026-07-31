/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // === Nujeen design tokens (from _design-reference :root) ===
        // Reskinning a future client = editing these values only.
        blue: '#13526E',
        blueBright: '#1B6CA8',
        ink: '#10242E',
        bone: '#FAF8F4',
        bone2: '#F2EEE7',
        rose: '#C97E76',
        roseSoft: '#F0E2DE',
        roseDark: '#9C5249',
        teal: '#2F8E78',
        grey: '#52606A',
        line: 'rgba(16,36,46,.10)',
        lineSoft: 'rgba(16,36,46,.06)',
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
      },
      maxWidth: {
        wrap: '1240px',
        read: '760px',
      },
      backdropBlur: {
        xs: '6px',
      },
    },
  },
  plugins: [],
};
