/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores customizadas conforme o design
        purple: {
          iptv: '#6A0DAD', // roxo principal
        },
        yellow: {
          iptv: '#FFD700', // amarelo principal
        },
      },
    },
  },
  plugins: [],
};
