/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        wood: {
          50:  '#FDF8F0',
          100: '#F8ECD8',
          200: '#EDD5B0',
          300: '#DEB878',
          400: '#C8933A',
          500: '#A67625',
          600: '#8B5E1A',
          700: '#6B4614',
          800: '#4A300E',
          900: '#2E1D08',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1c1917',
          },
        },
      },
    },
  },
  plugins: [],
};
