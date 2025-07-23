/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  safelist: [
    'bg-slate-100',
    'bg-orange-50',
    'bg-orange-100',
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-amber-50',
    'bg-yellow-50',
    'bg-red-100',
    'bg-purple-50',
    'bg-green-100',
    'bg-gray-200',
    'bg-rose-100'
  ],

  theme: {
    extend: {},
  },

  plugins: [require('tailwindcss-animate')],
};