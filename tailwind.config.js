/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#17211f',
        panel: '#f7f8f5',
        line: '#d8ded6',
        brand: '#0f766e',
        action: '#2563eb',
        warn: '#b45309',
        done: '#15803d',
      },
      boxShadow: {
        soft: '0 12px 28px rgba(23, 33, 31, 0.08)',
      },
    },
  },
  plugins: [],
};
