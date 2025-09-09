/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: { 50:"#eff6ff",100:"#dbeafe",600:"#2563eb",700:"#1d4ed8",900:"#0b0f19" }
      },
    },
  },
  plugins: [],
};
