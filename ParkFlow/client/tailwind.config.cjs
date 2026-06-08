/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'parkflow-primary': '#0d9488',
        'parkflow-accent': '#06b6d4',
        'parkflow-bg': '#f1f5f9'
      },
      borderRadius: {
        lg: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'park-lg': '0 10px 30px rgba(2,6,23,0.08)',
      },
    },
  },
  plugins: [],
};
